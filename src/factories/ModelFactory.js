  import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import Models from "../data/Models.json"

import { GlobalStuff } from "../helpers/GlobalStuff"


//urls
import Floor1URL from "../assets/models/DCMfloor2.glb"
import Wall1URL from "../assets/models/DCMwall1.glb"
import Hero1URL from "../assets/models/Hero1.2.glb" 
import Goblin1URL from "../assets/models/Goblin1.2.glb"
import Skeleton1URL from "../assets/models/Skeleton1.2.glb"
import Zombie1URL from "../assets/models/Zombie1.4.glb" 
import Lizard1URL from "../assets/models/Lizardman1.glb" 
import Ghost1URL from "../assets/models/Ghost1.glb"
import WarriorURL from "../assets/models/Warrior.glb"
import RogueURL from "../assets/models/Rogue1.1.glb"
import ClericURL from "../assets/models/Cleric.glb"


const urls={}

urls[Models.floor1]=Floor1URL
urls[Models.wall1] = Wall1URL
urls[Models.hero1] = Hero1URL
urls[Models.goblin1] = Goblin1URL
urls[Models.skeleton1] = Skeleton1URL
urls[Models.zombie1] = Zombie1URL
urls[Models.lizardman1] = Lizard1URL
urls[Models.ghost1] = Ghost1URL
urls[Models.warrior] = WarriorURL
urls[Models.rogue] = RogueURL
urls[Models.cleric] = ClericURL

const materials={}
const geometries={}

const loadModel=(
  position={x:0,y:0,z:0},
  rotation={x:0,y:0,z:0},
  url,
  onLoad = (()=> false),
  modelId,
  scale = 1,
  materialColors
)=> {
  
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
      
      if (materialColors){
        
        gltf.scene.traverse(child=>{
          if (child.isMesh) {
            for (const [key, color] of Object.entries(materialColors)) {
              //console.log(child.material.name)
              if (key.toLowerCase() == child.material.name.toLowerCase()) {
                child.material.color.set(color)
              }
            }
  
          }
        })
      }
      
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
  
    
    
}



const createModel=({
  graphicsScene,
  position,
  modelId,
  rotation,
  onLoad,
  scale=1,
  materialColors
}) =>{
  
  
  loadModel(
    position,
    rotation,
    urls[modelId],
    (model,animations,gltf)=>{
      onLoad(model,animations,gltf)
    },
    modelId,
    scale,
    materialColors
  )
}


export default createModel