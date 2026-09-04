import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export interface ToastProviderProps {
  position?: "top-right" | "bottom-right" | "bottom-center" | "top-center";
}

/**
 * CELAEST Ultra-Luxury Toast Provider
 * Positioned in bottom-right by default to preserve the pristine central Orb hero canvas.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ position = "bottom-right" }) => {
  return (
    <SonnerToaster
      position={position}
      expand={false}
      richColors={false}
      closeButton={false}
      duration={4500}
      offset={24}
      gap={10}
      toastOptions={{
        unstyled: true,
        className: "pointer-events-auto select-none",
      }}
    />
  );
};
