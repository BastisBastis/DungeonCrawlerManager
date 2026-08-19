import {
  defineQuery,
  hasComponent
} from "bitecs"

//Components

import { Position } from "../components/Position" 

import { BattleUnit } from "../components/BattleUnit" 
//Data

//Helpers
import { EventCenter } from "../helpers/EventCenter" 


export const createGoalSystem =(world)=>{
  
  
  const unitQuery=defineQuery([BattleUnit,Position])
  
  const goal = world.scene.level.goal
  
  return (world, dt)=>{
    
    
    unitQuery(world).forEach(id=>{
      
      const cellSize = world.scene.level.cellSize
      
      var col = Math.floor((Position.x[id] + cellSize/2) /cellSize)
      var row = Math.floor((Position.y[id] + cellSize/2) /cellSize)
      
      //console.log(col,row,goal)
      
      if (col == goal.x && row == goal.y) {
        EventCenter.emit("goalReached")
        
      }
      
    })
    
    
    
    return world
  }
  
}