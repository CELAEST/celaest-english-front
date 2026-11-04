import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ProfessorAnimState } from "./professorTypes";
import { ProfessorVisorCanvas } from "./ProfessorVisorCanvas";
import { CyberVisorFaceEngine } from "./CyberVisorFaceEngine";

export class ProfessorRigController {
  private headBone: THREE.Bone | null = null;
  private readonly headBaseQuat = new THREE.Quaternion();
  private readonly headSmoothedQuat = new THREE.Quaternion();
  private readonly headTargetQuat = new THREE.Quaternion();

  public readonly visorCanvas: ProfessorVisorCanvas;
  public faceEngine: CyberVisorFaceEngine | null = new CyberVisorFaceEngine({
    archetype: "astro_chibi",
    themeId: "cyan",
    emotion: "idle",
    speakingVariant: "vocal_capsule",
    listeningVariant: "ear_radar",
    emissiveIntensity: 1.8,
    scanlines: true,
  });
  private faceTexture: THREE.CanvasTexture | null = null;
  public visorReadyPromise: Promise<boolean> | null = null;
  private visorMaterials: THREE.MeshStandardMaterial[] = [];
  private visorGroup: THREE.Group | null = null;

  private readonly tmpEuler = new THREE.Euler(0, 0, 0, "YXZ");
  private readonly tmpDelta = new THREE.Quaternion();

  private elapsed = 0;
  private stateTime = 0;
  private currentState: ProfessorAnimState = "idle";
  private pointerX = 0;
  private pointerY = 0;

  private readonly root: THREE.Object3D;

  constructor(root: THREE.Object3D) {
    this.root = root;
    this.visorCanvas = new ProfessorVisorCanvas();

    // Preserve 100% of the original GLB rest pose for all body, spine, arms, legs and neck.
    // Zero bone overwriting or body deformation. ONLY head moves naturally.
    root.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        const cleanName = bone.name.replace(/:/g, "").toLowerCase();
        if (cleanName === "mixamorighead" || cleanName === "head") {
          this.headBone = bone;
          this.headBaseQuat.copy(bone.quaternion);
          this.headSmoothedQuat.copy(bone.quaternion);
          this.headTargetQuat.copy(bone.quaternion);

          // Load authentic visor directly from Blender export (zero procedural squircles)
          this.visorReadyPromise = this.tryLoadCustomVisorGlb();
        }
      }
    });
    root.updateMatrixWorld(true);
  }

  private ensureFaceTexture(): THREE.CanvasTexture | null {
    if (!this.faceEngine) return null;
    if (!this.faceTexture || this.faceTexture.image !== this.faceEngine.getCanvas()) {
      this.faceTexture?.dispose();
      const tex = new THREE.CanvasTexture(this.faceEngine.getCanvas());
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.flipY = false;
      this.faceTexture = tex;
    }
    this.faceTexture.needsUpdate = true;
    return this.faceTexture;
  }

  private async tryLoadCustomVisorGlb(): Promise<boolean> {
    const paths = ["/models/visor.glb", "/visor.glb"];
    const loader = new GLTFLoader();

    for (const path of paths) {
      try {
        const gltf = await loader.loadAsync(path);
        if (!gltf || !gltf.scene || !this.headBone) continue;

        // Clean up any existing visor
        if (this.visorGroup) {
          this.headBone.remove(this.visorGroup);
          this.visorGroup = null;
        }

        const visorMesh = gltf.scene;
        visorMesh.name = "ProfessorBlenderCustomVisor";

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry.attributes.color) {
              mesh.geometry.deleteAttribute("color");
            }

            // Smooth radial dome normals across the visor surface:
            // Eliminates all residual geometry creases (eyebrow ridges, eye socket wrinkles)
            // so light falls across the screen with a single, perfectly smooth, satin curvature.
            const normAttr = mesh.geometry.attributes.normal;
            const posAttr = mesh.geometry.attributes.position;
            if (normAttr && posAttr) {
              for (let i = 0; i < posAttr.count; i++) {
                const x = posAttr.getX(i);
                let y = posAttr.getY(i);
                const z = posAttr.getZ(i);

                // Smooth radial dome normals across the visor surface:
                // Eliminates all residual geometry creases (eyebrow ridges, eye socket wrinkles)
                // so light falls across the screen with a single, perfectly smooth, satin curvature.
                const dx = x;
                const dy = (y - 1.31) * 0.65;
                const dz = Math.max(0.12, z - 0.12);
                const len = Math.hypot(dx, dy, dz) || 1;
                normAttr.setXYZ(i, dx / len, dy / len, dz / len);
              }
              normAttr.needsUpdate = true;
            }

            // Satin obsidian cyber screen material:
            // Anti-glare OLED finish (roughness 0.92, metalness 0.0) eliminates all harsh specular glare
            // and residual geometry eyebrow ridges so digital OLED eyes pop with 100% clean luminance
            const mat = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0x000000),
              emissive: this.faceEngine ? new THREE.Color(0xffffff) : new THREE.Color(0x000000),
              emissiveMap: this.ensureFaceTexture(),
              emissiveIntensity: this.faceEngine ? this.faceEngine.getConfig().emissiveIntensity : 0,
              roughness: 0.92,
              metalness: 0.0,
              side: THREE.DoubleSide,
              transparent: false,
              depthWrite: true,
            });
            mesh.material = mat;
            this.visorMaterials.push(mat);
            mesh.renderOrder = 100;
          }
        });

        // Ensure headBone is in its calibrated neutral rest pose during attach
        // so world-to-local transform is 100% deterministic regardless of gestures in flight
        const currentQuat = this.headBone.quaternion.clone();
        this.headBone.quaternion.copy(this.headBaseQuat);
        this.headBone.updateMatrixWorld(true);

        // Add to character root in world space first
        this.root.add(visorMesh);
        visorMesh.updateMatrixWorld(true);

        // Attach to headBone so it rotates with head tracking
        this.headBone.attach(visorMesh);
        this.visorGroup = visorMesh;

        // Restore active head rotation
        this.headBone.quaternion.copy(currentQuat);
        this.headBone.updateMatrixWorld(true);

        return true;
      } catch (err) {
        console.error(`[Professor3D] Failed to load visor from ${path}:`, err);
      }
    }
    return false;
  }

  public setFaceEngine(engine: CyberVisorFaceEngine | null): void {
    this.faceEngine = engine;
    this.applyFaceEngineToMaterials();
  }

  public applyFaceEngineToMaterials(): void {
    for (const mat of this.visorMaterials) {
      if (this.faceEngine) {
        mat.emissive = new THREE.Color(0xffffff);
        mat.emissiveMap = this.ensureFaceTexture();
        mat.emissiveIntensity = this.faceEngine.getConfig().emissiveIntensity;
        mat.roughness = 0.92;
        mat.metalness = 0.0;
      } else {
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveMap = null;
        mat.emissiveIntensity = 0;
        mat.roughness = 0.92;
        mat.metalness = 0.0;
      }
      mat.needsUpdate = true;
    }
  }

  public snapHeadAngles(yaw: number, pitch = 0, roll = 0): void {
    if (!this.headBone) return;
    this.tmpEuler.set(pitch, yaw, roll, "YXZ");
    this.tmpDelta.setFromEuler(this.tmpEuler);
    this.headTargetQuat.copy(this.headBaseQuat).multiply(this.tmpDelta);
    this.headSmoothedQuat.copy(this.headTargetQuat);
    this.headBone.quaternion.copy(this.headSmoothedQuat);
    this.headBone.updateMatrixWorld(true);
  }

  public setState(next: ProfessorAnimState): void {
    if (this.currentState !== next) {
      this.currentState = next;
      this.stateTime = 0;
      if (this.faceEngine) {
        const emo =
          next === "explaining"
            ? "speaking"
            : next === "listening"
            ? "listening"
            : next === "celebrating"
            ? "happy"
            : "idle";
        this.faceEngine.setConfig({
          emotion: emo,
          speakingVariant: "vocal_capsule",
          listeningVariant: "ear_radar",
        });
      }
    }
  }

  public setPointer(normX: number, normY: number): void {
    this.pointerX = Math.max(-1, Math.min(1, normX));
    this.pointerY = Math.max(-1, Math.min(1, normY));
    this.faceEngine?.setPointerGaze(this.pointerX, this.pointerY);
  }

  public update(dt: number): void {
    const clampedDt = Math.min(0.05, Math.max(0.001, dt));
    this.elapsed += clampedDt;
    this.stateTime += clampedDt;
    const t = this.elapsed;

    if (!this.headBone) return;

    // Smooth head gaze tracking (follows mouse cursor with subtle organic micro-movements)
    const isExplaining = this.currentState === "explaining";
    const gazeYaw = this.pointerX * 0.20 + (isExplaining ? 0 : Math.sin(t * 0.65) * 0.02);
    const gazePitch = Math.max(
      -0.065,
      Math.min(0.065, this.pointerY * 0.065 + (isExplaining ? 0 : Math.cos(t * 0.8) * 0.015)),
    );
    const roll = isExplaining ? 0 : Math.sin(t * 0.5) * 0.01;

    let extraPitch = 0;
    let extraYaw = 0;
    let extraRoll = 0;

    if (isExplaining) {
      // Natural conversational head gestures (expressive teaching nods, warm engagement & tilt)
      // Harmonics locked to 2.4s (72 frames @ 30 FPS) for 100% seamless loop continuity
      const w0 = (Math.PI * 2) / 2.4;
      const st = this.stateTime;
      extraPitch = Math.sin(st * w0 * 2) * 0.068 + Math.sin(st * w0 * 5) * 0.026;
      extraYaw = Math.sin(st * w0 * 1) * 0.098 + Math.sin(st * w0 * 3) * 0.032;
      extraRoll = Math.sin(st * w0 * 2) * 0.038 + Math.sin(st * w0 * 3) * 0.016;

      // Vestibulo-ocular eye engagement: keep OLED eyes warmly focused on student while nodding/turning
      if (Math.abs(this.pointerX) < 0.01 && Math.abs(this.pointerY) < 0.01) {
        this.faceEngine?.setPointerGaze(-extraYaw * 2.4, -extraPitch * 1.6);
      }
    } else if (this.currentState === "listening") {
      // Attentive head tilt towards student
      extraPitch = 0.020 + Math.sin(t * 1.6) * 0.012;
      extraYaw = gazeYaw * 0.2;
      extraRoll = 0.040;
    } else if (this.currentState === "celebrating") {
      // Warm affirmative nod
      const nod = Math.sin(this.stateTime * 6.0) * Math.exp(-this.stateTime * 0.6) * 0.05;
      extraPitch = nod + 0.015;
      extraRoll = Math.sin(this.stateTime * 2.8) * 0.02;
    }

    // Apply local delta directly on head without deforming shoulders, collar or body
    this.tmpEuler.set(gazePitch + extraPitch, gazeYaw + extraYaw, roll + extraRoll, "YXZ");
    this.tmpDelta.setFromEuler(this.tmpEuler);
    this.headTargetQuat.copy(this.headBaseQuat).multiply(this.tmpDelta);

    // Exponential slerp for buttery smooth transitions
    const alpha = 1 - Math.exp(-8.0 * clampedDt);
    this.headSmoothedQuat.slerp(this.headTargetQuat, alpha);
    this.headBone.quaternion.copy(this.headSmoothedQuat);

    // Visor is rigidly attached to headBone in authentic Blender geometry,
    // backed by the hermetic collar neck seal for 100% gapless obsidian finish.

    // Update dynamic reactive expressions on cyber visor
    if (this.faceEngine) {
      this.faceEngine.update(clampedDt);
      if (this.faceTexture) this.faceTexture.needsUpdate = true;
    } else {
      this.visorCanvas.update(clampedDt, this.currentState);
    }
  }

  public dispose(): void {
    this.visorCanvas.dispose();
    this.faceTexture?.dispose();
    this.faceEngine?.dispose();
  }
}

