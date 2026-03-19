"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* skip on touch devices */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const outer = outerRef.current!;
    const dot = dotRef.current!;
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      gsap.to(outer, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    /* grow cursor on interactive elements */
    const onEnter = () =>
      gsap.to(outer, {
        scale: 1.6,
        opacity: 0.5,
        borderColor: "rgba(99, 91, 255, 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
    const onLeave = () =>
      gsap.to(outer, {
        scale: 1,
        opacity: 1,
        borderColor: "rgba(99, 91, 255, 0.35)",
        duration: 0.3,
        ease: "power2.out",
      });

    const bindHovers = () => {
      document.querySelectorAll("button, a, .magnetic").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    window.addEventListener("mousemove", onMove);
    bindHovers();

    /* re-bind after potential DOM changes */
    const observer = new MutationObserver(bindHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={outerRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
