import { RefObject, useCallback, useEffect, useRef } from "react";
import { CyberVisorFaceEngine, VisorFaceEmotion } from "./CyberVisorFaceEngine";
import { loadProfessorHeadBitmaps } from "./professorModelCacheService";
import { ProfessorAnimState } from "./professorTypes";
import {
  findBestHeadBitmap,
  HEAD_FRAME_COUNT,
  HEAD_REST_INDEX,
  renderProfessorCompositeFrame,
} from "./visorOverlayRenderer";

function mapStateToEmotion(state: ProfessorAnimState): VisorFaceEmotion {
  if (state === "explaining") return "speaking";
  if (state === "listening") return "listening";
  if (state === "thinking") return "thinking";
  if (state === "celebrating" || state === "greeting") return "happy";
  return "idle";
}

export function useProfessorCanvasLoop(
  hostRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  imgRef: RefObject<HTMLImageElement | null>,
  state: ProfessorAnimState,
  isActive: boolean,
  externalFaceEngine?: CyberVisorFaceEngine,
) {
  const bitmapsRef = useRef<Array<ImageBitmap | null>>([]);
  const internalEngineRef = useRef<CyberVisorFaceEngine | null>(null);
  const modeRef = useRef<ProfessorAnimState>(state);
  const greetingUntilRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(HEAD_REST_INDEX);
  const currentFrameRef = useRef<number>(HEAD_REST_INDEX);

  const getEngine = useCallback((): CyberVisorFaceEngine => {
    if (externalFaceEngine) return externalFaceEngine;
    if (!internalEngineRef.current) {
      internalEngineRef.current = new CyberVisorFaceEngine({
        archetype: "astro_chibi",
        themeId: "cyan",
        emotion: mapStateToEmotion(modeRef.current),
        speakingVariant: "vocal_capsule",
        listeningVariant: "ear_radar",
        emissiveIntensity: 1.8,
        scanlines: true,
      });
    }
    return internalEngineRef.current;
  }, [externalFaceEngine]);

  useEffect(() => {
    modeRef.current = state;
    if (state !== "idle") greetingUntilRef.current = 0;
    if (!externalFaceEngine) {
      getEngine().setConfig({ emotion: mapStateToEmotion(state) });
    }
  }, [state, externalFaceEngine, getEngine]);

  useEffect(() => {
    let alive = true;
    void loadProfessorHeadBitmaps().then((bmps) => {
      if (alive) bitmapsRef.current = bmps;
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!isActive) return;
    let rafId = 0;
    let prev = performance.now();
    let ctx: CanvasRenderingContext2D | null = null;

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - prev) / 1000));
      prev = now;
      const engine = getEngine();

      const activeState: ProfessorAnimState =
        modeRef.current === "idle" && now < greetingUntilRef.current ? "greeting" : modeRef.current;
      if (!externalFaceEngine) {
        engine.setConfig({ emotion: mapStateToEmotion(activeState) });
      }

      if (activeState === "explaining") {
        const sway = Math.sin(now * 0.0018) * 2.0;
        targetFrameRef.current = HEAD_REST_INDEX + sway;
        engine.setPointerGaze(Math.sin(now * 0.0012) * 0.08, 0);
      } else if (activeState !== "idle") {
        targetFrameRef.current = HEAD_REST_INDEX;
        engine.setPointerGaze(0, 0);
      }

      const alpha = 1 - Math.exp(-8.5 * dt);
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * alpha;
      engine.update(dt);

      const best = findBestHeadBitmap(bitmapsRef.current, currentFrameRef.current);
      const canvas = canvasRef.current;
      if (best && canvas) {
        if (!ctx) ctx = canvas.getContext("2d", { alpha: true });
        if (ctx) {
          renderProfessorCompositeFrame(ctx, best.bmp, engine, best.idx, canvas.width, canvas.height);
          if (imgRef.current && imgRef.current.style.opacity !== "0") {
            imgRef.current.style.opacity = "0";
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, getEngine, externalFaceEngine, canvasRef, imgRef]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (modeRef.current !== "idle") return;
      const el = hostRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.32;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.45)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.45)));

      targetFrameRef.current = Math.max(0, Math.min(HEAD_FRAME_COUNT - 1, HEAD_REST_INDEX + nx * HEAD_REST_INDEX));
      getEngine().setPointerGaze(nx * 0.85, ny * 0.75);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [hostRef, getEngine]);

  return useCallback(() => {
    if (modeRef.current === "idle") {
      greetingUntilRef.current = performance.now() + 1800;
    }
  }, []);
}

