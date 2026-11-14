import { createScene } from "./scene";
import { loadStrawberry } from "./loadStrawberry.ts";
import { hideLoader, setProgress } from "./loadingScreen.ts";
import { playIntro } from "./animations/intro.ts";
import { playEnter } from "./animations/enter.ts";
import { setupSections, type Section } from "./sections.ts";
import type * as THREE from "three";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
const title = document.querySelector("h1") as HTMLElement;
const button = document.querySelector("#enter") as HTMLButtonElement;

const { scene, camera, controls } = createScene(canvas);
const strawberry = await loadStrawberry(setProgress);

// Fade the loader out over an empty scene, so the strawberry doesn't show through
await hideLoader();
scene.add(strawberry);

await playIntro(strawberry);

button.addEventListener(
  "click",
  () => playEnter(camera, controls, title, button),
  { once: true },
);

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
  complete: [parts.seeds, parts.stem, parts.body],
  seeds: [parts.seeds],
  stem: [parts.stem],
  strawberry: [parts.body],
};

setupSections((section) => {
  for (const part of Object.values(parts)) {
    part.visible = visibleParts[section].includes(part);
  }
});
