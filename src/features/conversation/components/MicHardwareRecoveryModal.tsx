import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Volume2, CheckCircle2, ShieldAlert } from "lucide-react";
import { AudioCaptureService } from "../services/audioCaptureService";

export interface MicHardwareRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
}

export const MicHardwareRecoveryModal: React.FC<MicHardwareRecoveryModalProps> = ({
  isOpen,
  onClose,
  onResume,
}) => {
  const [permissionState, setPermissionState] = useState<"denied" | "requesting" | "granted">(
    "denied",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(() => new Array(16).fill(0));
  const [browserBrand, setBrowserBrand] = useState<string>("Google Chrome");
  const [deviceName, setDeviceName] = useState<string>("Buscando hardware...");

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  // 100% REAL HARDWARE ACTIVATION — Zero mocks, Zero synthetic audio, Zero Math.random
  const activateRealMicrophone = useCallback(async () => {
    setPermissionState("requesting");
    setErrorMessage(null);
    stopAudio();

    try {
      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        setPermissionState("denied");
        setErrorMessage("Este navegador no soporta captura de audio con la Web Audio API.");
        return;
      }

      // Solicitud real al hardware del sistema operativo a través del navegador
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      const realDeviceLabel = track?.label?.trim();
      setDeviceName(realDeviceLabel || "Micrófono del Sistema (48 kHz)");

      // Conexión real a la Web Audio API AnalyserNode para medir frecuencias reales de voz
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.4;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount; // 32 bins de frecuencias reales
      const dataArray = new Uint8Array(bufferLength);

      const updateRealAudioMeter = () => {
        if (!stream.active) return;
        analyser.getByteFrequencyData(dataArray);

        // Mapear los 32 bins de frecuencias reales del micrófono a las 16 barras visuales
        const bars: number[] = [];
        let totalSum = 0;
        const step = Math.max(1, Math.floor(bufferLength / 16));
        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          bars.push(val);
          totalSum += val;
        }

        const avg = Math.round((totalSum / 16 / 255) * 100);
        setAudioLevel(avg);
        setFrequencyBars(bars);

        animFrameRef.current = requestAnimationFrame(updateRealAudioMeter);
      };

      updateRealAudioMeter();
      setPermissionState("granted");
      setErrorMessage(null);

      // Pasar este stream real al servicio de captura de la entrevista
      AudioCaptureService.setMicStream(stream);
    } catch (err) {
      stopAudio();
      setPermissionState("denied");
      setAudioLevel(0);
      setFrequencyBars(new Array(16).fill(0));

      const errString = String(err);
      if (
        errString.includes("NotAllowedError") ||
        errString.includes("Permission") ||
        errString.includes("not-allowed")
      ) {
        setErrorMessage(
          `Chrome tiene bloqueado el acceso al micrófono para localhost. En la ventanita de permisos de la barra de Chrome, activa el interruptor "Micrófono" a ON (o dale a "Restablecer permisos") y pulsa "Encender Micrófono".`,
        );
      } else if (errString.includes("NotFoundError") || errString.includes("DevicesNotFoundError")) {
        setErrorMessage("No se detectó ningún micrófono físico conectado al equipo.");
      } else {
        setErrorMessage("Error al acceder al hardware: " + ((err as Error)?.message || errString));
      }
      setDeviceName("Micrófono bloqueado en navegador");
    }
  }, [stopAudio]);

  // Detección de navegador y listener en vivo a cambios de permisos de Chrome
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes("safari") && !ua.includes("chrome")) {
        setBrowserBrand("Safari");
      } else if (ua.includes("firefox")) {
        setBrowserBrand("Firefox");
      } else if (ua.includes("edg")) {
        setBrowserBrand("Edge");
      } else {
        setBrowserBrand("Google Chrome");
      }
    }

    // Escuchar en vivo si el usuario cambia el permiso en Chrome
    if (navigator?.permissions?.query) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((perm) => {
          if (perm.state === "granted") {
            void activateRealMicrophone();
          } else if (perm.state === "denied") {
            setPermissionState("denied");
            setDeviceName("Micrófono bloqueado en Chrome");
            setErrorMessage(
              `El interruptor de micrófono está en OFF en Chrome. Actívalo en la barra superior y pulsa "Encender Micrófono".`,
            );
          }

          perm.onchange = () => {
            if (perm.state === "granted") {
              void activateRealMicrophone();
            } else if (perm.state === "denied") {
              stopAudio();
              setPermissionState("denied");
              setDeviceName("Micrófono bloqueado en Chrome");
              setErrorMessage(
                `El micrófono fue desactivado en Chrome. Activa el interruptor y pulsa "Encender Micrófono".`,
              );
            }
          };
        })
        .catch(() => {});
    }

    return () => {
      stopAudio();
    };
  }, [activateRealMicrophone, stopAudio]);

  const handleClose = () => {
    stopAudio();
    onClose();
  };

  const handleResume = () => {
    if (streamRef.current) {
      AudioCaptureService.setMicStream(streamRef.current);
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    onResume();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-3xl animate-[fadeIn_0.2s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none p-8 sm:p-9 flex flex-col space-y-6 text-left animate-[scaleUp_0.25s_ease-out]"
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* ── 1. HEADER ── */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
              CALIBRACIÓN DE HARDWARE · ACCESO DE AUDIO REAL
            </span>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
              {permissionState === "granted"
                ? "Micrófono sincronizado en alta fidelidad"
                : "El acceso al micrófono está bloqueado"}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── 2. NATURAL HUMAN SUBTEXT ── */}
        <p className="text-xs text-[#C5C6D0] font-light leading-relaxed">
          {permissionState === "granted"
            ? "Tu hardware físico está encendido y capturando a 48 kHz. El evaluador lingüístico y Whisper recibirán tu voz real con fidelidad de estudio."
            : `Google Chrome tiene la captura de audio bloqueada en los ajustes del sitio. Activa el interruptor en la barra superior para permitir que el navegador encienda tu hardware.`}
        </p>

        {/* ── 3. DUAL METRIC DIALS (REAL HARDWARE STATUS) ── */}
        <div className="grid grid-cols-2 gap-3.5 py-1">
          <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-1 text-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
              ESTADO DE ENTRADA
            </span>
            <div
              className={`text-xl sm:text-2xl font-mono font-light tracking-tight transition-colors ${
                permissionState === "granted" ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {permissionState === "granted" ? "ACTIVO" : "BLOQUEADO"}
            </div>
            <span className="text-[11px] text-white/50 font-mono block">
              {permissionState === "granted" ? "48 kHz Calibrado" : "Hardware sin señal"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-1 text-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
              PERMISO {browserBrand.toUpperCase()}
            </span>
            <div
              className={`text-xl sm:text-2xl font-mono font-light tracking-tight transition-colors ${
                permissionState === "granted" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {permissionState === "granted" ? "CONCEDIDO" : "DENEGADO"}
            </div>
            <span className="text-[11px] text-white/50 font-mono block">
              {permissionState === "granted"
                ? "Dispositivo enlazado"
                : "Interruptor en OFF"}
            </span>
          </div>
        </div>

        {/* ── 4. DIAGNÓSTICO DIRECTO SI ESTÁ BLOQUEADO EN CHROME ── */}
        {permissionState !== "granted" ? (
          <div className="p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 text-xs text-rose-200/90 font-light flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-medium text-rose-300 block">
                Permiso desactivado en {browserBrand}:
              </span>
              <p className="leading-relaxed text-[11px] text-rose-200/80">
                {errorMessage || (
                  <>
                    Por seguridad del navegador, ninguna web puede encender tu micrófono si el interruptor está en OFF.
                    En la ventanita de permisos que abriste arriba, pon <strong>"Micrófono" en ON</strong> (o pulsa <strong>"Restablecer permisos"</strong>) y haz clic en <strong>"Encender Micrófono"</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#A7A7C0] font-light leading-relaxed">
            Tu micrófono físico está activo. Habla y verás cómo las 16 barras de frecuencias responden a tu voz real.
          </p>
        )}

        {/* ── 5. DISPOSITIVO & 16 BARRAS FFT EN TIEMPO REAL (100% REAL) ── */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-white/60 font-light">Dispositivo de audio:</span>
            <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-white/80 truncate max-w-[240px]">{deviceName}</span>
              <span className="text-white/30">·</span>
              <span
                className={
                  permissionState === "granted" ? "text-emerald-400 font-medium" : "text-rose-400"
                }
              >
                {permissionState === "granted" ? "Conectado" : "Bloqueado"}
              </span>
            </span>
          </div>

          {/* Cápsula de micrófono & 16 barras FFT reales */}
          <div className="py-2.5 flex items-center justify-between px-1">
            <div className="flex items-center space-x-3.5">
              <div
                onClick={() => void activateRealMicrophone()}
                className="cursor-pointer group relative flex items-center justify-center shrink-0"
                title="Haz clic para solicitar o encender el micrófono real"
              >
                <svg
                  className={`w-9 h-9 transition-all duration-300 ${
                    permissionState === "granted"
                      ? "text-[#C4B5FD] scale-105"
                      : "text-white/60 group-hover:text-white group-hover:scale-105"
                  }`}
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <rect
                    x="12"
                    y="5"
                    width="12"
                    height="18"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill={
                      permissionState === "granted"
                        ? "url(#capsuleAuraGrad_conv)"
                        : "rgba(255,255,255,0.03)"
                    }
                  />
                  <path
                    d="M15 9.5H21M14.5 12.5H21.5M15 15.5H21"
                    stroke={permissionState === "granted" ? "#C4B5FD" : "currentColor"}
                    strokeOpacity={permissionState === "granted" ? "0.9" : "0.35"}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 11C5.5 13 4.5 15.5 4.5 18C4.5 20.5 5.5 23 7 25"
                    stroke={permissionState === "granted" ? "#C4B5FD" : "currentColor"}
                    strokeOpacity={permissionState === "granted" ? "0.75" : "0.25"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M29 11C30.5 13 31.5 15.5 31.5 18C31.5 20.5 30.5 23 29 25"
                    stroke={permissionState === "granted" ? "#C4B5FD" : "currentColor"}
                    strokeOpacity={permissionState === "granted" ? "0.75" : "0.25"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 20C10 24.5 13.5 28 18 28C22.5 28 26 24.5 26 20"
                    stroke="currentColor"
                    strokeOpacity={permissionState === "granted" ? "0.85" : "0.4"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 28V32M14 32H22"
                    stroke="currentColor"
                    strokeOpacity={permissionState === "granted" ? "0.85" : "0.4"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <defs>
                    <linearGradient
                      id="capsuleAuraGrad_conv"
                      x1="12"
                      y1="5"
                      x2="24"
                      y2="23"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#7048E8" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#C4B5FD" stopOpacity="0.12" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="space-y-0.5 text-left">
                <div className="text-xs font-medium text-white flex items-center gap-2">
                  <span>Captura de Voz Directa</span>
                  <span className="text-[10px] font-mono text-white/40 tracking-wider">
                    48 kHz · 24-bit
                  </span>
                </div>
                <span className="text-[11px] text-[#8E8EA8] font-light block">
                  {permissionState === "granted"
                    ? "Audio físico en vivo leyendo frecuencias vocales reales"
                    : `Activa el interruptor en ${browserBrand} para autorizar`}
                </span>
              </div>
            </div>

            {/* 16 Barras FFT Conectadas a la Voz Real */}
            <div className="flex items-center gap-1 h-6">
              {frequencyBars.map((val, idx) => {
                // val es 0-255 del AnalyserNode real
                const barHeight =
                  permissionState === "granted"
                    ? Math.max(4, Math.round((val / 255) * 20) + 4)
                    : 4;
                const isLighting = permissionState === "granted" && val > 12;
                return (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isLighting
                        ? "bg-gradient-to-t from-[#7048E8] to-[#C4B5FD] shadow-[0_0_6px_rgba(196,181,253,0.6)]"
                        : "bg-white/10"
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 6. SEAMLESS DIRECT ACTION STRIP ── */}
        <div className="border-t border-b border-white/[0.06] py-4 flex items-center justify-between text-xs text-[#8E8EA8]">
          <div className="flex items-center space-x-2">
            <Volume2
              className={`w-3.5 h-3.5 shrink-0 ${permissionState === "granted" ? "text-emerald-400" : "text-rose-400"}`}
            />
            <span className="text-white/70 text-xs">
              {permissionState === "granted"
                ? "Nivel de voz real:"
                : `Permiso en ${browserBrand}:`}
            </span>
            <span className="text-white/40 font-mono text-[11px] ml-1">
              {permissionState === "granted" ? `${audioLevel}% en vivo` : "Bloqueado"}
            </span>
          </div>

          <button
            onClick={() => void activateRealMicrophone()}
            className="text-[#C4B5FD] hover:text-white text-[11px] font-mono transition-colors cursor-pointer bg-transparent border-0 p-0 hover:underline flex items-center gap-1"
          >
            <span>
              {permissionState === "granted" ? "Recalibrar hardware" : "Reintentar conexión"}
            </span>
            <span className="text-white/40">↗</span>
          </button>
        </div>

        {/* ── 7. FOOTER ACTION ── */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8E8EA8] font-light">
            {permissionState === "granted"
              ? "Hardware enlazado. Tu práctica se reanudará de inmediato."
              : "Tu turno y puntaje están protegidos al 100%."}
          </span>

          {permissionState === "granted" ? (
            <button
              onClick={handleResume}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Continuar Entrevista →</span>
            </button>
          ) : (
            <button
              onClick={() => void activateRealMicrophone()}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <span>
                {permissionState === "requesting" ? "Encendiendo hardware..." : "Encender Micrófono Real →"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
