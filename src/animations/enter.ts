import gsap from "gsap";
import { Flip } from "gsap/all";
import type { PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

gsap.registerPlugin(Flip);

export function playEnter(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  title: HTMLElement,
  button: HTMLElement,
) {
  // Built paused: main.ts plays it on Enter and reverses it on Home.
  // The caller disables controls before playing/reversing; they come back on at either end.
  return gsap
    .timeline({
      paused: true,
      onComplete: () => {
        controls.enabled = true;
      },
      onReverseComplete: () => {
        controls.enabled = true;
      },
    })
    .to(camera.position, {
      x: 0,
      y: 0,
      z: 3,
      duration: 1.4,
      ease: "power3.inOut",
    })
    .to(
      title,
      {
        yPercent: () => -window.innerHeight,
        duration: 1.2,
        ease: "power3.inOut",
      },
      "<",
    )
    .to(
      button,
      { yPercent: () => window.innerHeight, duration: 0.8, ease: "power3.in" },
      "<",
    )
    // Once the camera has arrived: title drops in from above, arrows slide in from the sides
    .set("#details", { visibility: "visible" })
    .from("#section-title", { yPercent: -100, duration: 0.8, ease: "power3.out" })
    .from(
      "#prev",
      { x: () => -window.innerWidth / 2, duration: 0.9, ease: "power3.out" },
      "<",
    )
    .from(
      "#next",
      { x: () => window.innerWidth / 2, duration: 0.9, ease: "power3.out" },
      "<",
    )
    .from("#home", { y: -150, duration: 0.9, ease: "power3.out" }, "<");
}
