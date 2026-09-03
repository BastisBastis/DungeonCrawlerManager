import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

//Factories
import createModel from "../factories/Model"


//Components

import { Position } from "../components/Position" 
import { Rotation } from "../components/Rotation"
import { Color } from "../components/Color" 
import { ClassType, UnitClass, ClassIds } from "../components/ClassType"
import { BattleUnit } from "../components/BattleUnit" 
import { Dead } from "../components/Dead" 

//Data
import { ClassColors } from "../data/ClassColors"
import Models from "../data/Models.json"
import { EventCenter } from "../helpers/EventCenter"

var gameObjects = {}
var objects3d = {}

export const createGraphicsSystem =(world)=>{
  objects3d = {}
  gameObjects = {}
  world.scene.objects3d = objects3d
  var followedUnit = 0
  
  const unitQuery=defineQuery([BattleUnit,Position,Color])
  const unitEnterQuery=enterQuery(unitQuery)
  
  
  return (world, dt)=>{
    
    unitEnterQuery(world).forEach(id=>{
      const object = world.scene.add.rectangle(
            Position.x[id],
            Position.y[id],
            10,
            10,
            Color.hex[id]
          ).setDepth(60)
      
      
      gameObjects[id]=object
      console.log(ClassType.type[id], ClassIds[ClassType.type[id]],ClassColors[ClassIds[ClassType.type[id]]])
      createModel({
        graphicsScene: world.scene.graphicsScene,
        position: {
          x: Position.x[id], 
          y:0, 
          z: Position.y[id]
        },
        modelId:Models.hero1,
        scale:10,
        rotation: {x:0,y:0,z:0},
        materialColors:ClassColors[ClassIds[ClassType.type[id]]],
        onLoad:(gltfScene,animations,gltf)=>{
          world.scene.graphicsScene.add(gltf.scene)
          objects3d[id] = gltf
          EventCenter.emit("modelLoaded", {id, gltf})
        }
      })
    })
    
    if (hasComponent(world, Dead, followedUnit)) {
      followedUnit = 0
      
    }
      
    
    unitQuery(world).forEach(id=>{
      
      if (hasComponent(world, Dead, id)) {
        gameObjects[id].setVisible(false)
        return
      }
        
      
      if (followedUnit == 0) {
        followedUnit = id
        world.scene.cameras.main.startFollow(gameObjects[id], true, 0.8, 0.8)
        world.scene.cameras.main.setFollowOffset(400,0)
        
      }
      gameObjects[id].setPosition(
        Position.x[id],
        Position.y[id]
      )
      if (objects3d[id]) {
        objects3d[id].scene.position.set(
          Position.x[id],
            -64,
          Position.y[id]
        )
        objects3d[id].scene.rotation.y = Rotation.radians[id] + Math.PI/2
      }
      
    })
    
    if (followedUnit != 0) {
      world.scene.camera.position.set(
        Position.x[followedUnit]-200,
        300,
        Position.y[followedUnit]+200
      )
    }
    
    
    
    
    
    return world
  }
  
}