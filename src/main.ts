import { createScene } from "./scene";
import { loadStrawberry } from "./loadStrawberry.ts";
import { hideLoader, setProgress } from "./loadingScreen.ts";
import { playIntro } from "./animations/intro.ts";
import { CAMERA_DURATION, flyTo, playChange } from "./animations/change.ts";
import { setupSections, type Section } from "./sections.ts";
import type * as THREE from "three";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
const title = document.querySelector("h1") as HTMLElement;
const changeButton = document.querySelector("#change") as HTMLButtonElement;
const useButton = document.querySelector("#use") as HTMLButtonElement;
const descriptionSlot = document.querySelector("#description-slot") as HTMLElement;

const { scene, camera, controls } = createScene(canvas);
const strawberry = await loadStrawberry(setProgress);

function getPart(name: string) {
  const part = strawberry.getObjectByName(name);
  if (!part) throw new Error(`"${name}" not found in .glb`);
  return part;
}

// Object names from the Blender Outliner
const parts = {
  seeds: getPart("seeds"),
  stem: getPart("stem"),
  body: getPart("Sphere"), // the red strawberry
};

// Which parts each section shows. Record<Section, ...> makes TypeScript
// complain if a section in sections.ts is missing here.
const visibleParts: Record<Section, THREE.Object3D[]> = {
  strawberry: [parts.seeds, parts.stem, parts.body],
  seeds: [parts.seeds],
  stem: [parts.stem],
  body: [parts.body],
};

setupSections((section) => {
  for (const part of Object.values(parts)) {
    part.visible = visibleParts[section].includes(part);
  }
});

// Fade the loader out over an empty scene, so the strawberry doesn't show through
await hideLoader();
scene.add(strawberry);

await playIntro(strawberry, changeButton, descriptionSlot);

// One UI timeline: Change plays it forward, Use plays it backward.
// The camera flies separately (flyTo), so it always starts from where it is now.
const enter = playChange(controls, title);

changeButton.addEventListener("click", () => {
  // Stop the mouse from moving the camera while GSAP moves it
  controls.enabled = false;
  flyTo(camera, controls, 3);
  enter.play();
});

useButton.addEventListener("click", () => {
  controls.enabled = false;
  // In reverse the camera moves during the last CAMERA_DURATION seconds, as it did
  // in the old timeline: first the details leave, then the camera backs off
  flyTo(camera, controls, 4, Math.max(0, enter.time() - CAMERA_DURATION));
  enter.reverse();
});




