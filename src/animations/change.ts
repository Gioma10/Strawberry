import gsap from "gsap";
import { Flip } from "gsap/all";
import type { PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

gsap.registerPlugin(Flip);

export function playChange(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  title: HTMLElement,
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
      "#project",
      {
        yPercent: () => -window.innerHeight,
        duration: 1.2,
        ease: "power3.inOut",
      },
      "<",
    )
    // Description leaves downward together with the Change button...
    .to(
      "#description-slot",
      { y: 150, autoAlpha: 0, duration: 0.8, ease: "power3.in" },
      "<",
    )
    .to(
      "#change",
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
    .from("#use", { y: 150, duration: 0.9, ease: "power3.out" }, "<")
    // ...and comes back up with the Use button, a bit lower (8% of the screen):
    // the strawberry is bigger in details. Played in reverse (Use), the same two
    // tweens make it leave with Use and come back with Change.
    .fromTo(
      "#description-slot",
      { y: () => window.innerHeight * 0.08 + 150, autoAlpha: 0 },
      {
        y: () => window.innerHeight * 0.08,
        // Phones (below Tailwind's sm, 640px): no room for it in details, so it stays hidden
        autoAlpha: () => (window.matchMedia("(max-width: 639px)").matches ? 0 : 1),
        duration: 0.9,
        ease: "power3.out",
        // Otherwise the from values would apply at build time and hide it in the home
        immediateRender: false,
      },
      "<",
    );
}
