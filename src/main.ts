import { createScene } from "./scene";
import { loadStrawberry } from "./loadStrawberry.ts";
import { hideLoader, setProgress } from "./loadingScreen.ts";
import { playIntro } from "./animations/intro.ts";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const { scene } = createScene(canvas);
const strawberry = await loadStrawberry(setProgress);

// Fade the loader out over an empty scene, so the strawberry doesn't show through
await hideLoader();
scene.add(strawberry);
playIntro(strawberry);
