import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

import * as THREE from "three"


//Components

import { Position } from "../components/Position" 
import { UnitIndex } from "../components/UnitIndex"

//Data
import { EventCenter } from "../helpers/EventCenter"

//Helpers



export const createSpotlightSystem =(world)=>{
  const spotlights = {}
  
  const setSpotlightVisibility = (id, value) =>{
    //console.log(id, value)
    if (world.scene.objects3d[id]) {
       const object = world.scene.objects3d[id]
       if (object.spotlight) {

         object.spotlight.visible = value
      
       }
      }
  }
  
  EventCenter.on("selectUnit", id=>{
    try { 
    setSpotlightVisibility(id, true)
    } catch (er) {console.log(er.message,er.stack); throw er} 
  })
  EventCenter.on("deselectUnit", id=>{
    setSpotlightVisibility(id, false)
  })

  
  const unitQuery=defineQuery([UnitIndex, Position])
  const unitEnterQuery=enterQuery(unitQuery)
  
  
  return (world, dt)=>{
   
   function createSpotlightWithTarget(object) {
     const spotlight = new THREE.SpotLight(
      0xffffff, 
      8
     )
   
     
     spotlight.position.set(0, 20, 0)
      
      spotlight.angle = Math.PI / 16
      
      spotlight.penumbra = .99
      
      spotlight.decay = 2
      
      spotlight.distance = 600
   
     const target = new THREE.Object3D()
     target.position.set(0, 19, 0)
   
     object.add(spotlight)
     object.add(target)
   
     spotlight.target = target
     
     spotlight.visible = false
   
     return spotlight
   }
    
    /*
    unitEnterQuery(world).forEach(id=>{
      const spotLight = new THREE.SpotLight(0xffffff, 100)

      spotLight.position.set(0, 200, 0)
      
      spotLight.angle = Math.PI / 6
      
      spotLight.penumbra = 0.5
      
      spotLight.decay = 2
      
      spotLight.distance = 300
      
      
      //spotLight.target.position.set(0, 0, 0)
      
      world.graphicsScene.add(spotLight)
      
      //scene.add(spotLight.target)
    }) */
      
    const cam3d = world.scene.camera

    unitQuery(world).forEach(id=>{
      
      
      
      if (world.scene.objects3d[id]) {
       const object = world.scene.objects3d[id]
       if (!object.spotlight) {

         object.spotlight = createSpotlightWithTarget(object.scene)
         //console.log(object.spotlight)
      
       }
       // console.log(object.spotlight.position)
     //console.log(object.spotlight.target.position)
      }
    })
    
    
    
    return world
  }
  
}