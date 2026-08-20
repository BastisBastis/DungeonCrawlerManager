import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

//Components

import { Position } from "../components/Position" 

import { Color } from "../components/Color" 

import { BattleUnit } from "../components/BattleUnit" 
import { Dead } from "../components/Dead" 

//Data

var gameObjects = {}

export const createGraphicsSystem =(world)=>{
  
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
    })
    
    if (hasComponent(world, Dead, followedUnit)) {
      followedUnit = 0
      console.log("new followed unit")
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
    })
    
    
    
    return world
  }
  
}