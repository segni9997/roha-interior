import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin outside the hook
gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export const resetSmoothScroll = () => {
  if (lenisInstance) {
    try {
      lenisInstance.scrollTo(0, { immediate: true });
    } catch {
      // ignore
    }
  }
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
  const mainEl = document.getElementById("main");
  if (mainEl) {
    mainEl.scrollTop = 0;
  }
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 50);
};

export const isAdminOrBuilderRoute = (path?: string) => {
  const p = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  return (
    p.startsWith('/admin') ||
    p.startsWith('/builder') ||
    p.startsWith('/trusted-party-builder')
  );
};

export const useSmoothScroll = (currentPath?: string) => {
  useEffect(() => {
    // 1. Initialize Lenis if not already initialized
    if (!lenisInstance) {
      const lenis = new Lenis({
        lerp: 0.1, // Smoothness (0.1 is standard)
        duration: 1.2,
        smoothWheel: true,
      });
      lenisInstance = lenis;

      // 2. Synchronize ScrollTrigger with Lenis
      lenis.on('scroll', ScrollTrigger.update);

      // 3. Connect GSAP ticker to Lenis
      const gsapTicker = (time: number) => {
        lenis.raf(time * 1000); // Lenis expects milliseconds
      };

      gsap.ticker.add(gsapTicker);
      gsap.ticker.lagSmoothing(0);
    }

    // Check if the current route is an administrative CMS or Visual Builder workspace
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    if (isAdminOrBuilderRoute(path)) {
      lenisInstance?.stop();
    } else {
      lenisInstance?.start();
    }

    // 4. Cleanup function
    return () => {
      // Don't kill global instance across re-renders; maintain clean ticker on unmount
    };
  }, [currentPath]);
};