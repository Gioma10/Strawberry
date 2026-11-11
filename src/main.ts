import { GLTFLoader, RoomEnvironment } from "three/examples/jsm/Addons.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import * as THREE from "three";

// Select canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 4);

// Create Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// AgX is Blender's default view transform (4.x)
renderer.toneMapping = THREE.AgXToneMapping;

// Soft studio lighting with reflections, like a Blender World/HDRI
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Key light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Upload Strawberry from public folder
// Meshopt decoder: lets us load .glb files exported with Meshopt Compression
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

loader.load(
  "/strawberry.glb",
  (gltf) => {
    // The .glb also contains a plane and an Empty: keep only the strawberry
    const strawberry = gltf.scene.getObjectByName("Sphere");
    if (!strawberry) throw new Error('"Sphere" object not found in .glb');

    // Uniform scale: longest side = 2.5 units
    const box = new THREE.Box3().setFromObject(strawberry);
    const size = box.getSize(new THREE.Vector3());
    strawberry.scale.setScalar(2.5 / Math.max(size.x, size.y, size.z));

    // Center the strawberry on the origin
    box.setFromObject(strawberry);
    strawberry.position.sub(box.getCenter(new THREE.Vector3()));

    scene.add(strawberry);
    // Fade the canvas in only once the strawberry is ready
    canvas.classList.remove("opacity-0");
    console.log("Strawberry uploaded");
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("Error upload", error);
  },
);

// Keep the strawberry centered when the window is resized
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
