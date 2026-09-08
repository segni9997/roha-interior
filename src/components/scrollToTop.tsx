import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Scroll window (body/html)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      
      // Scroll main container if exists (for overflow cases)
      const mainEl = document.getElementById("main");
      if (mainEl) {
        mainEl.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    };

    // Immediate scroll
    scrollToTop();

    // Fallback for smooth behavior timing
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
