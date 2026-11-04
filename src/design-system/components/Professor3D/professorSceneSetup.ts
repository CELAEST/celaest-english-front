import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { loadProfessorGlbBuffer } from "./professorModelCacheService";
import { ProfessorRigController } from "./professorRigController";
import { ProfessorCameraPreset } from "./professorTypes";

let parsedTemplatePromise: Promise<THREE.Group> | null = null;

function tuckChibiFaceUnderVisor(root: THREE.Object3D): void {
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geom = mesh.geometry;
      if (!geom || !geom.attributes.position) return;

      const pos = geom.attributes.position;
      let modified = false;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Retract original face features covered by visor.
        // Visor bottom rim follows the smooth natural curve: 1.048 + 0.60 * x^2.
        // Visor top rim follows: 1.565 - 0.35 * x^2.
        // Retracting the entire face cavity eliminates any white skin, eyebrows, or forehead vertices
        // from poking in front of or clipping through the visor.
        const rimY = 1.048 + 0.60 * x * x;
        const topRimY = 1.565 - 0.35 * x * x;
        if (Math.abs(x) <= 0.28 && y >= rimY && y <= topRimY && z > 0.22) {
          pos.setZ(i, 0.18);
          modified = true;
        }
      }

      if (modified) {
        pos.needsUpdate = true;
        // Preserves original artist-baked normals on chin and hoodie to prevent white triangle peaks
      }
    }
  });
}

async function getSharedProfessorTemplate(): Promise<THREE.Group> {
  if (!parsedTemplatePromise) {
    parsedTemplatePromise = (async () => {
      const buffer = await loadProfessorGlbBuffer();
      const loader = new GLTFLoader();
      const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
        loader.parse(buffer, "", resolve, reject);
      });
      tuckChibiFaceUnderVisor(gltf.scene);
      return gltf.scene;
    })().catch((err) => {
      parsedTemplatePromise = null;
      throw err;
    });
  }
  return parsedTemplatePromise;
}

export interface MountedProfessorStage {
  controller: ProfessorRigController;
  setActive: (active: boolean) => void;
  setCameraPreset: (preset: ProfessorCameraPreset) => void;
  stepFrame: (dt: number) => string;
  renderNow: () => string;
  dispose: () => void;
}

export async function mountProfessorStage(
  container: HTMLElement,
  preset: ProfessorCameraPreset,
  onReady?: () => void,
): Promise<MountedProfessorStage | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  renderer.domElement.className = "w-full h-full block pointer-events-none select-none";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);

  let activePreset = preset;
  let fitBox: THREE.Box3 | null = null;

  // Frames the whole character (antennas to feet, hands included) for the current aspect ratio.
  const fitFullBody = () => {
    if (!fitBox) return;
    const size = fitBox.getSize(new THREE.Vector3());
    const center = fitBox.getCenter(new THREE.Vector3());
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const margin = 1.1;
    const distV = (size.y * margin) / 2 / Math.tan(vFov / 2);
    const distH = (size.x * margin) / 2 / Math.tan(hFov / 2);
    camera.position.set(center.x, center.y, center.z + Math.max(distV, distH) + size.z / 2);
    camera.lookAt(center);
  };

  // Frames the character to be as large as possible ("lo más grande posible")
  // while strictly ensuring zero clipping on sleeves, elbows, or hands (marginH = 1.02).
  const fitTutorStage = () => {
    if (!fitBox) return;
    const size = fitBox.getSize(new THREE.Vector3());
    const center = fitBox.getCenter(new THREE.Vector3());
    const vFovRad = THREE.MathUtils.degToRad(camera.fov);
    const hTan = Math.tan(vFovRad / 2) * camera.aspect;

    // Responsive mobile portrait vs desktop landscape framing:
    // In mobile portrait (aspect < 0.75), lift the character into the upper 65% of the viewport:
    // lookY = 0.36, posY = 0.44 and marginH = 0.92 eliminates dead black space at the top,
    // ensuring antennas, visor, face, hoodie and arms remain fully visible above the bottom board.
    const isPortrait = camera.aspect < 0.75;
    const marginH = isPortrait ? 0.92 : 1.02;
    const lookY = isPortrait ? 0.36 : 0.92;
    const posY = isPortrait ? 0.44 : 1.02;

    const distH = (size.x * marginH) / 2 / Math.max(0.10, hTan);
    camera.position.set(center.x, posY, center.z + distH + size.z / 2);
    camera.lookAt(center.x, lookY, center.z);
  };

  const applyCameraPose = (p: ProfessorCameraPreset) => {
    activePreset = p;
    if (p === "full-body") {
      camera.fov = 30;
      camera.position.set(0.0, 0.9, 4.0);
      camera.lookAt(0.0, 0.85, 0.0);
      camera.updateProjectionMatrix();
      fitFullBody();
      return;
    }
    if (p === "face-focus") {
      camera.fov = 24;
      camera.position.set(0.0, 1.32, 1.25);
      camera.lookAt(0.0, 1.30, 0.0);
    } else if (p === "bust-guide") {
      camera.fov = 28;
      camera.position.set(0.0, 1.35, 1.8);
      camera.lookAt(0.0, 1.30, 0.0);
    } else {
      // "tutor-stage": prominent hero framing where the robot is large, expressive and majestic
      camera.fov = 32;
      camera.position.set(0.0, 1.05, 4.2);
      camera.lookAt(0.0, 0.95, 0.0);
      if (fitBox) {
        fitTutorStage();
      }
      camera.updateProjectionMatrix();
      return;
    }
    camera.updateProjectionMatrix();
  };
  applyCameraPose(preset);

  // Balanced studio lighting (prevents blown-out white skin while keeping crisp edge separation)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1e1b4b, 0.85));
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(1.2, 2.0, 2.0);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.85);
  fillLight.position.set(-1.4, 1.4, 1.5);
  scene.add(fillLight);

  const violetRim = new THREE.PointLight(0xa27ff3, 3.2, 6.0);
  violetRim.position.set(-1.4, 1.5, -0.8);
  scene.add(violetRim);

  const skyRim = new THREE.PointLight(0x38bdf8, 1.8, 5.0);
  skyRim.position.set(1.4, 1.3, -0.6);
  scene.add(skyRim);

  const template = await getSharedProfessorTemplate();
  const character = SkeletonUtils.clone(template) as THREE.Group;
  const isBust = preset === "bust-guide";
  character.rotation.y = isBust ? 0.02 : 0.06;
  character.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.frustumCulled = false;

      const rawMat = mesh.material;
      const mat = (Array.isArray(rawMat) ? rawMat[0] : rawMat) as THREE.MeshStandardMaterial;
      if (mat) {
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.needsUpdate = true;
        }
        // Soften metalness so baked character textures (face, clothes, hair) pop vividly without black reflections
        mat.metalness = 0.05;
        mat.roughness = 0.7;
        if (mat.normalMap) {
          mat.normalScale?.set(0.6, 0.6);
        }
        mat.needsUpdate = true;
      }
    }
  });
  scene.add(character);
  character.updateMatrixWorld(true);
  fitBox = new THREE.Box3().setFromObject(character);
  if (activePreset === "full-body") fitFullBody();
  else if (activePreset === "tutor-stage") fitTutorStage();

  const controller = new ProfessorRigController(character);
  const syncSize = () => {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (activePreset === "full-body") fitFullBody();
    else if (activePreset === "tutor-stage") fitTutorStage();
    renderer.setSize(w, h, true);
  };
  syncSize();
  const resizeObs = typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncSize) : null;
  resizeObs?.observe(container);

  let disposed = false;
  let active = true;
  let rafId = 0;
  let lastNow = performance.now();

  const tick = (now: number) => {
    if (disposed || !active) return;
    const dt = (now - lastNow) / 1000;
    lastNow = now;
    controller.update(dt);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  };
  onReady?.();
  rafId = requestAnimationFrame(tick);

  return {
    controller,
    setActive(next: boolean) {
      if (active === next || disposed) return;
      active = next;
      if (active) {
        lastNow = performance.now();
        rafId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafId);
      }
    },
    setCameraPreset(p: ProfessorCameraPreset) {
      if (disposed) return;
      applyCameraPose(p);
    },
    stepFrame(dt: number): string {
      controller.update(dt);
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL("image/png");
    },
    renderNow(): string {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL("image/png");
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObs?.disconnect();
      controller.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
