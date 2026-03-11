import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useEntranceAnimation(options = {}) {
  const ref = useRef(null);

  const {
    y = 40,
    scale = 0.85,
    opacity = 0,
    duration = 0.7,
    ease = "elastic.out(1, 0.6)",
    delay = 0,
    stagger = false,
    staggerAmount = 0.08,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? el.children : el;

    gsap.set(targets, { y, scale, opacity });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.to(targets, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration,
          ease,
          delay,
          stagger: stagger ? staggerAmount : 0,
        });
      });
    });
  }, []);

  return ref;
}