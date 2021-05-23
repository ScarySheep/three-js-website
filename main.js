import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import blenderModelFile from './resources/faceless.glb?url'

const scene = new THREE.Scene()

//set up camera
//field of view, aspect ration and view frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0)

//set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

//add lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 10, 10)

const ambientLight = new THREE.AmbientLight(0x808080)
scene.add(pointLight, ambientLight)

//add helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

//add a torus
const torusGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100)
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 })
const torus = new THREE.Mesh(torusGeometry, torusMaterial)
scene.add(torus)

//add a box
const boxGeometry = new THREE.BoxGeometry(5, 0.5, 5)
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xEDEAD0 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.set(0, -0.25, 0)
scene.add(box)

//load my blender model
const loader = new GLTFLoader()
//add animation mixer
let mixer
let blenderModel
const clock = new THREE.Clock();
loader.load(blenderModelFile, function (gltf) {

  blenderModel = gltf.scene
  scene.add(blenderModel)

  mixer = new THREE.AnimationMixer(blenderModel)
  idle = mixer.clipAction(gltf.animations[1]).play()

}, undefined, function (error) {

  console.error(error);

});

//add star as background
function addStar () {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//add controls
const controls = new OrbitControls(camera, renderer.domElement)

window.onresize = function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

};

let angle = 0
function animate () {
  requestAnimationFrame(animate)

  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01

  angle = (angle == 359) ? 0 : (angle + 0.01)
  blenderModel.position.x = Math.cos(angle) * 2
  blenderModel.position.z = Math.sin(angle) * 2
  blenderModel.rotation.y += 0.05

  const delta = clock.getDelta();
  mixer.update(delta);

  controls.update()
  renderer.render(scene, camera)
}

animate()

