import gsap from "gsap";
import type { Object3D } from "three";

export function playIntro(strawberry: Object3D, changeButton: HTMLElement, description: HTMLElement) {
  // Target scale computed in loadStrawberry (longest side = 2.5 units)
  const scale = strawberry.scale.x;

  return (
    gsap
      // Short pause after the loader disappears
      .timeline({ delay: 0.3 })
      // Start from 0.001, not 0: a zero scale breaks Three.js lighting math
      .fromTo(
        strawberry.scale,
        { x: 0.001, y: 0.001, z: 0.001 },
        { x: scale, y: scale, z: scale, duration: 1.2, ease: "back.out(1.7)" },
      )
      .from(
        strawberry.rotation,
        { y: -Math.PI, duration: 1.5, ease: "power3.out" },
        "<",
      )
      .from(changeButton, {opacity:0, xPercent: 50})
      .from(description, {opacity:0, xPercent: -50}, "<")
  );
}
