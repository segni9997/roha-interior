import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetSmoothScroll } from "../hook/useSmoothScroll";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    resetSmoothScroll();
  }, [pathname, search]);

  useEffect(() => {
    // Secondary safety trigger after route component has mounted
    resetSmoothScroll();
    const frameId = requestAnimationFrame(() => {
      resetSmoothScroll();
    });
    return () => cancelAnimationFrame(frameId);
  }, [pathname, search]);

  return null;
}
