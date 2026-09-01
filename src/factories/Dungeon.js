import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {EventCenter} from "../helpers/EventCenter"
import {GlobalStuff} from "../helpers/GlobalStuff"

const updateCanvasBounds=(gameScene,renderer,camera) =>{
  const canvas = document.querySelector("#c")
  const { width, height, top, left } =gameScene.sys.canvas.getBoundingClientRect()
  canvas.style.top=top+"px"
  canvas.style.left=left+"px"
  renderer.setSize(
    width,
    height
  )
  
  const size= renderer.getSize(new THREE.Vector3())
   
}

const addLight = (scene) => {
  const color = 0xffbbcc
  const intensity = 1.2

  const dirLight = new THREE.DirectionalLight(color, intensity)

  dirLight.position.set(-100, 200, 100)

  dirLight.castShadow = true

  // Shadow camera
  dirLight.shadow.camera.top = 100
  dirLight.shadow.camera.bottom = -100
  dirLight.shadow.camera.left = -100
  dirLight.shadow.camera.right = 100

  dirLight.shadow.camera.near = 50
  dirLight.shadow.camera.far = 500

  // Shadow quality
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024

  dirLight.shadow.bias = -0.001

  dirLight.shadow.camera.updateProjectionMatrix()

  scene.add(dirLight)

    
  const helper = new THREE.CameraHelper(dirLight.shadow.camera)
  //scene.add(helper)
    
  const ambLight = new THREE.AmbientLight( 0x555555 )
  scene.add( ambLight )
}

const setupScene=()=> {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color( 0x330000 )
  
  if (false || GlobalStuff.Fog) {
    const color = 0x5599cc;  // white
    const near = 70;
    const far = 600;
    scene.fog = new THREE.Fog(color, near, far);
  }
    
  return scene
}

const setupCamera=(gameScene,renderer)=>{
  
  
  const { width, height } =gameScene.sys.canvas.getBoundingClientRect()
  
  const camera = new THREE.PerspectiveCamera(
    45,
    width/height,
    0.001,
    10000
  )
  
  camera.position.set(-200,300,200)
  camera.lookAt(0,0,0)
  

  return camera;
}

const setupRenderer=()=>{
  const canvas = document.querySelector("#c")
  const renderer = new THREE.WebGLRenderer({canvas:canvas,logarithmicDepthBuffer:true})
  renderer.outputEncoding = THREE.SRGBColorSpace
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true;
  
  
  
  return renderer;
}

const createOrbitControls=(camera,canvas)=>{
  canvas.style.zIndex=100
  return new OrbitControls(camera, canvas)
}

const createTestScene=(graphicsScene)=>{
  const geometry = new THREE.PlaneGeometry(20, 20)

  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

  const plane = new THREE.Mesh(geometry, material)

  plane.rotation.x = -Math.PI / 2
  plane.position.y = -200

  graphicsScene.add(plane)
}

export const createDungeonScene=(gameScene)=>{
  const renderer=setupRenderer()
  const scene=setupScene()
  
  const camera=setupCamera(gameScene,renderer)
  updateCanvasBounds(gameScene,renderer,camera)
  addLight(scene)
  
  
  EventCenter.on("canvasResize",()=>{
    updateCanvasBounds(gameScene,renderer,camera)
  })
   
  if (GlobalStuff.CameraStyle===3) {
    createOrbitControls(camera,renderer.domElement)
  }
  //createTestScene(scene)
  
  return {graphicsScene:scene,renderer:renderer,camera:camera}
}


