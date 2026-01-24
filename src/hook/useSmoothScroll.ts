import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin outside the hook
gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = () => {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.1, // Smoothness (0.1 is standard)
      duration: 1.2,
      smoothWheel: true,
    });

    // 2. Synchronize ScrollTrigger with Lenis
    // This tells GSAP to update whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Connect GSAP ticker to Lenis
    // This makes GSAP the "master" of the animation frame
    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000); // Lenis expects milliseconds
    };

    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0); // Prevents jumps after heavy computation

    // 4. Cleanup function
    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsapTicker);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};