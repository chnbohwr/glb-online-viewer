import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let mixer;

const clock = new THREE.Clock();
const container = document.getElementById('app');

const stats = new Stats();
container.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x35353);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 2, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

renderer.render(scene, camera);

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};


function animate() {
  requestAnimationFrame(animate);
  // const delta = clock.getDelta();
  // mixer.update(delta);
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

const loadedGLTF = (gltf)=>{
  window.VIEWERJSON = gltf;
  const model = gltf.scene || gltf.scenes[0];

  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  model.position.x += (model.position.x - center.x);
  model.position.y += (model.position.y - center.y);
  model.position.z += (model.position.z - center.z);

  camera.position.copy(center);
  camera.position.x += size / 2.0;
  camera.position.y += size / 5.0;
  camera.position.z += size / 2.0;
  camera.lookAt(center);
  camera.near = size / 100;
  camera.far = size * 100;

  scene.add(model);
  controls.reset();

  // animation
  // mixer = new THREE.AnimationMixer( model );
	// mixer.clipAction( gltf.animations[ 0 ] ).play();

  animate();
}

var fileEle = document.getElementById('glbfileEle');
fileEle.onchange = (e) => {
  const WURL = window.URL || window.webkitURL || window.mozURL;
  const file = e.target.files[0];
  var url = WURL.createObjectURL(file);
  console.log(url);
  loader.load(url, loadedGLTF);
};