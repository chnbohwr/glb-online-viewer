import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import './cssreset.css';

const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(800, 700, false);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 25;

const light = new THREE.AmbientLight(0xffffff);
var light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(500, 300, 500);
scene.add(light);
scene.add(light2);

const control = new OrbitControls(camera, renderer.domElement);
// control.enableZoom = false;


// const stat = new Stats();
// console.log(stat);

var appEle = document.getElementById('app');
console.log(appEle)
renderer.setSize(appEle.clientWidth, appEle.clientHeight);
const app = document.getElementById('app');
app.appendChild(renderer.domElement);
// app.appendChild(stat.domElement);
const render = () => {
  // group.rotateX(0.001);
  // group.rotateY(0.001);
  // group.rotateZ(0.001);
  renderer.render(scene, camera);
  // stat.update();
  // control.update();
  requestAnimationFrame(render);
};

render();

window.URL = window.URL || window.webkitURL || window.mozURL;
var fileEle = document.getElementById('glbfileEle');
fileEle.onchange = (e) => {
  const file = e.target.files[0];
  var url = URL.createObjectURL(file);
  console.log(url);
  loader.load(url,(model)=>{
    console.log(model);
    scene.add(model.scene);
  })
};