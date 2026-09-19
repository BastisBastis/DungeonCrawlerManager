import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

import * as THREE from "three"

//UI
import { NameTagUI } from "../ui/NameTagUI"


//Components

import { Position } from "../components/Position" 
import { Name } from "../components/Name"
import { NameTag } from "../components/NameTag"
//Data
import { EventCenter } from "../helpers/EventCenter"

//Helpers
import { NameHelper } from "../helpers/NameHelper"


export const createNameTagSystem =(world)=>{
  const tagObjects = {}

  
  const unitQuery=defineQuery([Name, NameTag, Position])
  const unitEnterQuery=enterQuery(unitQuery)
  
  
  return (world, dt)=>{
    
    unitEnterQuery(world).forEach(id=>{
      tagObjects[id] = new NameTagUI(world.scene, 0, 0, NameHelper.GetName(world, id))
    })
      
    const cam3d = world.scene.camera

    unitQuery(world).forEach(id=>{
      
      const position = new THREE.Vector3(
        Position.x[id],
        0,
        Position.y[id]
      )
      
      if (world.scene.objects3d[id]) {
       /*  var position = new THREE.Vector3()
        
        

        world.scene.objects3d[id].scene.getWorldPosition(position)
 */
        const screenPosition = position
          .clone()
          .project(world.scene.camera)

        const width = world.scene.renderer.domElement.clientWidth
        const height = world.scene.renderer.domElement.clientHeight

        const x = (screenPosition.x + 1) / 2 * width
        const y = (-screenPosition.y + 1) / 2 * height

        tagObjects[id].x = x
        tagObjects[id].y = y
        

// console.log(
//   "ECS",
// {  x:Position.x[id],
//      y:   0,
//        z: Position.y[id]},
//   "camera",
//   world.scene.camera.position,
//   "unit",
//   position,
//   "screen",
//   screenPosition
// )

      }
      
    })
    
    
    
    return world
  }
  
}