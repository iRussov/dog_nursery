import * as THREE from "../three-js/three.module.js";
import { GLTFLoader } from "../three-js/GLTFLoader.js";

document.addEventListener('DOMContentLoaded', init);
let mixer;
let mouseX = 0, mouseY = 0;
let isDragging = false;

function init() {
  const scene = new THREE.Scene();
  const container = document.querySelector('.dog3d');
  const width = container.clientWidth - 1;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 400);
  camera.position.set(-0.4, 0.9, 2.5);

  scene.rotation.y = -5 * Math.PI / 2.15;
  scene.rotation.x = Math.PI / 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff, 0);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0); 
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load("/static/3Dmodels/dog_puppy.glb", (gltf) => {
    const dogModel = gltf.scene;
    scene.add(dogModel);
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(dogModel);
      for (let i = 0; i < gltf.animations.length; i++) {
        const animation = gltf.animations[i];
        mixer.clipAction(animation).play();
      }
    }
  });

  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mousemove', onMouseMove);

  function onMouseDown(event) {
    isDragging = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onMouseMove(event) {
    if (!isDragging) return;
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;
    mouseX = event.clientX;
    mouseY = event.clientY;

    const sensitivity = 0.01; 
    scene.rotation.y += deltaX * sensitivity;
    scene.rotation.x += deltaY * sensitivity;
  }

  const animate = () => {
    requestAnimationFrame(animate);

    if (mixer) {
      mixer.update(0.016); 
    }

    renderer.render(scene, camera);
  };

  animate();
}
