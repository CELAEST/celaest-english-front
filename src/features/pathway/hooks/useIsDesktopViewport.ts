import { useEffect, useState } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

function readInitialDesktop(): boolean {
  if (typeof window === "undefined") return true;
  if (typeof window.innerWidth === "number" && window.innerWidth > 0) {
    return window.innerWidth >= 1024;
  }
  return window.matchMedia?.(DESKTOP_MEDIA_QUERY)?.matches ?? true;
}

export function useIsDesktopViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(readInitialDesktop);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.(DESKTOP_MEDIA_QUERY);
    const update = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    update();
    window.addEventListener("resize", update);
    mql?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mql?.removeEventListener?.("change", update);
    };
  }, []);

  return isDesktop;
}

