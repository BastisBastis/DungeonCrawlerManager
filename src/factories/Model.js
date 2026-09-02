  import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import Models from "../data/Models.json"

import { GlobalStuff } from "../helpers/GlobalStuff"


//urls
import Floor1URL from "../assets/models/DCMfloor2.glb"
import Wall1URL from "../assets/models/DCMwall1.glb"
import Hero1URL from "../assets/models/Hero1Animated.glb" 


const urls={}

urls[Models.floor1]=Floor1URL
urls[Models.wall1] = Wall1URL
urls[Models.hero1] = Hero1URL



const materials={}
const geometries={}

const loadModel=(
  position={x:0,y:0,z:0},
  rotation={x:0,y:0,z:0},
  url,
  onLoad = (()=> false),
  modelId,
  scale = 1 )=> {
  
  const loader = new GLTFLoader();
  
  
  loader.load(
    url,
    ( gltf ) =>{
      try { 
      
      

      let bbox = new THREE.Box3().setFromObject(gltf.scene);
                
      let size = bbox.getSize(new THREE.Vector3()); 
      const center = bbox.getCenter(new THREE.Vector3());
      //console.log(size)

      
      //TEMP
      
      if (modelId===Models.target)
        scale=6
      
      

      gltf.scene.scale.set(scale,scale,scale)
      //gltf.scene.position.set(position.x,position.y-size.y*2*scale,position.z)
      gltf.scene.position.set(position.x,position.y,position.z)
      gltf.scene.rotation.x=rotation.x
      gltf.scene.rotation.y=rotation.y
      gltf.scene.rotation.z=rotation.z
      
      /*
      if (!materials[modelId]) {
        
        const mat = new THREE.MeshToonMaterial({...gltf.scene.children[0].material})
        materials[modelId]=mat
        gltf.scene.children[0].material=mat
        
        //materials[modelId]=gltf.scene.children[0].material
      }
      gltf.scene.children[0].material=materials[modelId]
      
      if (!geometries[modelId]) {
        geometries[modelId]=gltf.scene.children[0].geometry
      }
      gltf.scene.children[0].geometry=geometries[modelId]
      
      */
      
      if (GlobalStuff.ToonShader) {
        gltf.scene.traverse(child=>{
          if (child.material) {
            child.material=new THREE.MeshToonMaterial({...child.material})
            
          }
        })
      }
      
      gltf.scene.traverse(object=>{
        
        if (object.isMesh) {
          
          object.geometry.computeVertexNormals()
          
          object.castShadow=true;
          object.receiveShadow=true;
        }
      })
      
      //fixes(gltf,modelId)
      
      /* Animation api
        this.mixer=new THREE.AnimationMixer(gltf.scene)
        this.animations={
          back:this.mixer.clipAction(gltf.animations[0]),
      */
      //console.log(gltf.animations.map(a=>a.name))
      
      onLoad(gltf.scene,gltf.animations,gltf)
      } catch (er) {console.log(er.message,er.stack)} 
    },
    // called while loading is progressing
    ( xhr ) => {
    //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    ( error )=> {
    console.log( 'An error happened');
    console.log(error.message)
    }
  );
}


const fixes=(gltf,modelId)=>{
  if ([
      Models.pirate1,
      Models.pirate2,
      Models.pirate3,
      Models.pirate4,
      Models.pirate5
    ].includes(modelId)) {
    let animNames={}
    gltf.animations.forEach((animation,i)=>{
      
      animation.name=animation.name.split(" ")[0]
      animation.name=animation.name.split("_")[0]
      animation.name=animation.name.split("Monkey")[0]
      if (animation.name.includes("Pose"))
        animation.name="Pose"
      
      if (animNames[animation.name]!==undefined)
        animation.name+=""+"_2"
      animNames[animation.name]=i
    })
    //console.log(animNames)
    if (gltf.scene.position.x>0){
      gltf.scene.traverse(child=>{
        if (child.isMesh) {
          
          if (child.material.color.getHex()==277266) {
            //child.material=new THREE.MeshNormalMaterial()
            child.material.color.set(0x6b2643)
          } 
        }
      })
    }
    
  } else if (modelId==Models.flag) {
      if (gltf.scene.position.x>0){
      gltf.scene.traverse(child=>{
        if (child.isMesh) {
          
          if (child.material.color.getHex()==277266) {
            //child.material=new THREE.MeshNormalMaterial()
            child.material.color.set(0x6b2643)
          } 
        }
      })
    }
  } else if (modelId==Models.boat) {
    gltf.scene.children.forEach(c=>{
      //c.position.y+=36.3
      c.position.y-=1
      
      
    })
    gltf.scene.traverse(child=>{
      if (child.isMesh&&child.name!=="Ship")
        child.position.y+=7
    })
  } else if (modelId==Models.target) {
    gltf.scene.children.forEach(c=>{
      c.position.y-=0.6
      c.rotation.y=Math.PI/2
      
    })
  }
}



const createModel=({
  graphicsScene,
  position,
  modelId,
  rotation,
  onLoad,
  scale=1
}) =>{
  
  
  loadModel(
    position,
    rotation,
    urls[modelId],
    (model,animations,gltf)=>{
      onLoad(model,animations,gltf)
    },
    modelId,
    scale
  )
}


export default createModel