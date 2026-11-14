import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const dracoLoader = new DRACOLoader().setDecoderPath("/draco/");
const loader = new GLTFLoader()
  .setDRACOLoader(dracoLoader)
  .setMeshoptDecoder(MeshoptDecoder);

export async function loadStrawberry(onProgress?: (progress: number) => void) {
  const gltf = await loader.loadAsync("/strawberry-draco.glb", (event) => {
    if (event.lengthComputable) onProgress?.(event.loaded / event.total);
  });

  const strawberry = gltf.scene.getObjectByName("Sphere");
  if (!strawberry) throw new Error('"Sphere" object not found in .glb');

  const box = new THREE.Box3().setFromObject(strawberry);
  const size = box.getSize(new THREE.Vector3());
  strawberry.scale.setScalar(2.5 / Math.max(size.x, size.y, size.z));

  box.setFromObject(strawberry);
  strawberry.position.sub(box.getCenter(new THREE.Vector3()));

  return strawberry;
}