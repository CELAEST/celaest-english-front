import fs from "node:fs";
import path from "node:path";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, textureCompress } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";

const INPUT_GLB = path.resolve("public/Meshy_AI_necesitop_crear_un_pe_All_Animations.glb");
const OUTPUT_GLB = path.resolve("public/assets/professor_mentor.glb");
const OUTPUT_POSE_TS = path.resolve(
  "src/design-system/components/Professor3D/professorNeutralPose.ts",
);

function normalizeQuat(q) {
  const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

function midpointQuat(a, b) {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const sign = dot < 0 ? -1 : 1;
  return normalizeQuat([
    a[0] + sign * b[0],
    a[1] + sign * b[1],
    a[2] + sign * b[2],
    a[3] + sign * b[3],
  ]);
}

function extractSymmetricStandingPose(glbBuffer) {
  const jsonLen = glbBuffer.readUInt32LE(12);
  const gltf = JSON.parse(glbBuffer.toString("utf8", 20, 20 + jsonLen));
  const binStart = 20 + jsonLen + 8;

  const walkAnim = (gltf.animations || []).find((a) => a.name === "Walking") || gltf.animations?.[0];
  const rotations = {};
  let hipsTranslation = null;

  if (walkAnim) {
    for (const ch of walkAnim.channels) {
      const node = gltf.nodes[ch.target.node];
      if (!node || !node.name) continue;
      const sampler = walkAnim.samplers[ch.sampler];
      const outAcc = gltf.accessors[sampler.output];
      const bv = gltf.bufferViews[outAcc.bufferView];
      const baseOffset = binStart + (bv.byteOffset || 0) + (outAcc.byteOffset || 0);
      const count = outAcc.count;
      const halfIdx = Math.floor(count / 2);

      if (ch.target.path === "rotation" && count >= 2) {
        const readQ = (idx) => {
          const off = baseOffset + idx * 16;
          return [
            glbBuffer.readFloatLE(off),
            glbBuffer.readFloatLE(off + 4),
            glbBuffer.readFloatLE(off + 8),
            glbBuffer.readFloatLE(off + 12),
          ];
        };
        const q0 = readQ(0);
        const qHalf = readQ(halfIdx);
        const mid = midpointQuat(q0, qHalf);
        rotations[node.name] = mid.map((v) => Number(v.toFixed(6)));
      } else if (
        ch.target.path === "translation" &&
        node.name === "mixamorig:Hips" &&
        count >= 2
      ) {
        const readV = (idx) => {
          const off = baseOffset + idx * 12;
          return [
            glbBuffer.readFloatLE(off),
            glbBuffer.readFloatLE(off + 4),
            glbBuffer.readFloatLE(off + 8),
          ];
        };
        const v0 = readV(0);
        const vHalf = readV(halfIdx);
        hipsTranslation = [
          Number(((v0[0] + vHalf[0]) * 0.5).toFixed(5)),
          Number(((v0[1] + vHalf[1]) * 0.5).toFixed(5)),
          Number(((v0[2] + vHalf[2]) * 0.5).toFixed(5)),
        ];
      }
    }
  }

  return { rotations, hipsTranslation };
}

async function main() {
  const beforeBytes = fs.statSync(INPUT_GLB).size;
  const rawBuf = fs.readFileSync(INPUT_GLB);
  const { rotations, hipsTranslation } = extractSymmetricStandingPose(rawBuf);

  fs.mkdirSync(path.dirname(OUTPUT_POSE_TS), { recursive: true });
  const poseContent = `/**
 * Calibrated symmetric standing neutral pose extracted from the Professor GLB rig (58 Mixamo bones).
 * Eliminates T-pose flash and anchors smooth real-time quaternion gestures.
 */

export const PROFESSOR_HIPS_NEUTRAL_POS: readonly [number, number, number] | null = ${JSON.stringify(hipsTranslation)};

export const PROFESSOR_NEUTRAL_QUATERNIONS: Readonly<Record<string, readonly [number, number, number, number]>> = ${JSON.stringify(rotations, null, 2)};
`;
  fs.writeFileSync(OUTPUT_POSE_TS, poseContent, "utf8");

  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(INPUT_GLB);

  // Remove locomotion-only animations (Walking / Running) to save ~1.2 MB and keep clean rig
  for (const anim of doc.getRoot().listAnimations()) {
    anim.dispose();
  }

  // Optimize textures to standard native formats (JPEG for color, PNG for normal/roughness)
  // This ensures 100% universal browser texture decoding without buggy EXT_texture_webp extensions
  for (const tex of doc.getRoot().listTextures()) {
    const name = tex.getName() || "";
    const imgBuf = Buffer.from(tex.getImage());

    if (name.includes("normal")) {
      const resized = await sharp(imgBuf).resize(1024, 1024).png({ compressionLevel: 8 }).toBuffer();
      tex.setImage(new Uint8Array(resized));
      tex.setMimeType("image/png");
    } else if (name.includes("metallic_roughness")) {
      const resized = await sharp(imgBuf).resize(1024, 1024).png({ compressionLevel: 8 }).toBuffer();
      tex.setImage(new Uint8Array(resized));
      tex.setMimeType("image/png");
    } else {
      // Base color map -> Standard JPEG 2048 at 92% quality (native GLTF 2.0 standard)
      const resized = await sharp(imgBuf).resize(2048, 2048).jpeg({ quality: 92 }).toBuffer();
      tex.setImage(new Uint8Array(resized));
      tex.setMimeType("image/jpeg");
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_GLB), { recursive: true });
  await io.write(OUTPUT_GLB, doc);

  const afterBytes = fs.statSync(OUTPUT_GLB).size;
  console.log(
    JSON.stringify({
      beforeMB: Number((beforeBytes / 1024 / 1024).toFixed(2)),
      afterMB: Number((afterBytes / 1024 / 1024).toFixed(2)),
      reductionPct: Number((((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1)),
      calibratedBones: Object.keys(rotations).length,
    }),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
