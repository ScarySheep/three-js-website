import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

import blenderModelFile from './resources/faceless.glb?url'
import tileFragment from './shaders/tile.frag?raw'
import tileVertex from './shaders/tile.vert?raw'
import cloudFragment from './shaders/cloud.frag?raw'
import cloudVertex from './shaders/cloud.vert?raw'
import lavaFragment from './shaders/lava.frag?raw'
import lavaVertex from './shaders/lava.vert?raw'

import tileCloudImg from './textures/lava/cloud.png'
import lavatileImg from './textures/lava/lavatile.jpg'
import coldtileImg from './textures/lava/coldtile.jpg'
import darktileImg from './textures/lava/darktile.jpg'


const scene = new THREE.Scene()
const clock = new THREE.Clock();

//load texture
const textureLoader = new THREE.TextureLoader();
const tileCloud = textureLoader.load(tileCloudImg)
const lavatile = textureLoader.load(lavatileImg)
const coldtile = textureLoader.load(coldtileImg)
const darktile = textureLoader.load(darktileImg)
tileCloud.wrapS = tileCloud.wrapT = THREE.RepeatWrapping;
lavatile.wrapS = lavatile.wrapT = THREE.RepeatWrapping;
coldtile.wrapS = coldtile.wrapT = THREE.RepeatWrapping;
darktile.wrapS = darktile.wrapT = THREE.RepeatWrapping;

//set up camera
//field of view, aspect ration and view frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 0)
camera.rotation.x = Math.PI
//set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

//add lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 10, 10)

const ambientLight = new THREE.AmbientLight(0x808080)
scene.add(pointLight, ambientLight)

//add helpers
const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(gridHelper)

//add one more torus with shader as an eye
let eyeShaderUniforms = {
  "time": { value: 1.0 },
  "uvScale": { value: new THREE.Vector2(3.0, 1.0) },
  "texture1": { value: tileCloud },
  "texture2": { value: coldtile }
};

const eyeShaderMaterial = new THREE.ShaderMaterial({
  uniforms: eyeShaderUniforms,
  vertexShader: tileVertex,
  fragmentShader: tileFragment
});

const eyeGeometry = new THREE.TorusGeometry(13, 6, 30, 30)
const eye = new THREE.Mesh(eyeGeometry, eyeShaderMaterial)
eye.position.set(0, 0, 60)
scene.add(eye)

/*//load my blender model
const loader = new GLTFLoader()
//add animation mixer
let mixer
let blenderModel

loader.load(blenderModelFile, function (gltf) {

  blenderModel = gltf.scene
  scene.add(blenderModel)

  mixer = new THREE.AnimationMixer(blenderModel)
  idle = mixer.clipAction(gltf.animations[1]).play()

}, undefined, function (error) {

  console.error(error);

});*/

//add cloud as background
const size = 128;
const data = new Uint8Array(size * size * size);

let i = 0;
const scale = 0.05;
const perlin = new ImprovedNoise();
const vector = new THREE.Vector3();

for (let z = 0; z < size; z++) {

  for (let y = 0; y < size; y++) {

    for (let x = 0; x < size; x++) {

      const d = 1.0 - vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length();
      data[i] = (128 + 128 * perlin.noise(x * scale / 1.5, y * scale, z * scale / 1.5)) * d * d;
      i++;
    }
  }
}

const cloudTexture = new THREE.DataTexture3D(data, size, size, size);
cloudTexture.format = THREE.RedFormat;
cloudTexture.minFilter = THREE.LinearFilter;
cloudTexture.magFilter = THREE.LinearFilter;
cloudTexture.unpackAlignment = 1;

let cloudShaderUniform = {
  base: { value: new THREE.Color(0x798aa0) },
  map: { value: cloudTexture },
  cameraPos: { value: new THREE.Vector3() },
  threshold: { value: 0.25 },
  opacity: { value: 0.3 },
  range: { value: 0.05 },
  steps: { value: 5 },
  frame: { value: 0 }
}

const cloudShaderMaterial = new THREE.RawShaderMaterial({
  glslVersion: THREE.GLSL3,
  uniforms: cloudShaderUniform,
  vertexShader: cloudVertex,
  fragmentShader: cloudFragment,
  side: THREE.BackSide,
  transparent: true
});

const geometry = new THREE.BoxGeometry(1, 1, 1);

function addCloud (x, y, z) {
  const cloud = new THREE.Mesh(geometry, cloudShaderMaterial)
  cloud.position.set(x, y, z)
  cloud.scale.set(50, 50, 50)
  scene.add(cloud)
}

addCloud(20, 20, 50)
addCloud(-30, -15, 40)
addCloud(30, -30, 70)

//add controls
//const controls = new OrbitControls(camera, renderer.domElement)

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

let sphereShaderUniforms = {
  "time": { value: 10.0 },
  "uvScale": { value: new THREE.Vector2(2, 1) },
  "texture1": { value: tileCloud },
  "texture2": { value: darktile }
};

const sphereShaderMaterial = new THREE.ShaderMaterial({
  uniforms: sphereShaderUniforms,
  vertexShader: tileVertex,
  fragmentShader: tileFragment
});

const sphereGeometry = new THREE.SphereGeometry(500, 8, 8, 0, Math.PI * 2, 0, Math.PI)
const sphere = new THREE.Mesh(sphereGeometry, sphereShaderMaterial);
sphere.rotation.x = 0.5 * Math.PI
sphere.material.side = THREE.BackSide
scene.add(sphere);

//lava ball

let lavaShaderUniforms = {
  "clippingZ": { value: 33 },
  "time": { value: 1.0 },
  "uvScale": { value: new THREE.Vector2(2.0, 1.0) },
  "texture1": { value: tileCloud },
  "texture2": { value: lavatile }
};

const lavaShaderMaterial = new THREE.ShaderMaterial({
  uniforms: lavaShaderUniforms,
  vertexShader: lavaVertex,
  fragmentShader: lavaFragment,
  side: THREE.BackSide
});

let lavaTheta = 1
const lavaGeometry = new THREE.SphereGeometry(15, 16, 16, 0, Math.PI * 2, 0, lavaTheta * Math.PI)
const lava = new THREE.Mesh(lavaGeometry, lavaShaderMaterial);
lava.rotation.x = -0.5 * Math.PI
scene.add(lava);


let speed = 0
let animationStart = false

window.ontouchstart = function () {
  if (!animationStart) {
    speed = 0
    animationStart = true
  } else {
    animationStart = false
    lavaShaderUniforms['clippingZ'].value = -33
    lavaShaderUniforms['time'].value = 1
  }
}

let click = document.getElementById("click")
window.onmousedown = function () {
  if (!animationStart) {
    click.textContent = "Click"
    click.style.display = "none"
    speed = 0
    animationStart = true
  } else {
    if (lavaShaderUniforms['clippingZ'].value <= 15) {
      click.style.display = "block"
      animationStart = false
      lavaShaderUniforms['clippingZ'].value = 33
      lavaShaderUniforms['time'].value = 1
    }
  }
}


//let angle = 0
function animate () {
  requestAnimationFrame(animate)
  const delta = clock.getDelta();
  /*
    angle = (angle == 359) ? 0 : (angle + 0.01)
    blenderModel.position.x = Math.cos(angle) * 2
    blenderModel.position.z = Math.sin(angle) * 2
    blenderModel.rotation.y += 0.05  
    mixer.update(delta);*/

  eyeShaderUniforms['time'].value += 2 * delta;
  sphereShaderUniforms['time'].value -= 0.1 * delta;
  lavaShaderUniforms['time'].value += 1 * delta;
  //controls.update()
  speed += 1
  if (animationStart) {
    if (lavaShaderUniforms['clippingZ'].value >= -15) {
      lavaShaderUniforms['time'].value -= 0.000005 * speed * speed;
      lavaShaderUniforms['clippingZ'].value -= 0.0003 * speed;
      if (lavaShaderUniforms['clippingZ'].value < 20) {
        lavaShaderUniforms['clippingZ'].value -= 0.0015 * speed;
      }
    }
  }


  renderer.render(scene, camera)
  if (1 / delta < 30) {
    console.log(1 / delta)
  }
}

animate()

