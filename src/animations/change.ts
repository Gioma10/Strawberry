import gsap from "gsap";
import { Flip } from "gsap/all";
import { Spherical, type PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

gsap.registerPlugin(Flip);

export const CAMERA_DURATION = 1.4;

let cameraTween: gsap.core.Tween | undefined;

// Moves the camera around the strawberry (on a sphere), not in a straight line:
// a straight line from behind would go through the strawberry and flip the view.
// Built on every click, so it always starts from where the user left the camera.
export function flyTo(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  radius: number,
  delay = 0,
) {
  // Flush the damping inertia left by a drag, so OrbitControls doesn't keep
  // rotating the camera while GSAP moves it (one update without damping zeroes it)
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = true;

  // Fast clicks: drop the previous flight instead of running two at once
  cameraTween?.kill();

  // Current position as distance + angles around the center (the controls target)
  const s = new Spherical().setFromVector3(camera.position);

  cameraTween = gsap.to(s, {
    radius,
    phi: Math.PI / 2, // eye level
    theta: 0, // front; setFromVector3 returns -PI..PI, so this is the shorter way round
    duration: CAMERA_DURATION,
    delay,
    ease: "power3.inOut",
    onUpdate: () => {
      camera.position.setFromSpherical(s);
    },
  });
}

// UI only: the camera moves with flyTo, started by main.ts next to play/reverse.
export function playChange(controls: OrbitControls, title: HTMLElement) {
  // Built paused: main.ts plays it on Change and reverses it on Use.
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
    .to(title, {
      yPercent: () => -window.innerHeight,
      duration: 1.2,
      ease: "power3.inOut",
    })
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
    // Explicit time: the details appear once the camera (flyTo) has arrived
    .set("#details", { visibility: "visible" }, CAMERA_DURATION)
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
