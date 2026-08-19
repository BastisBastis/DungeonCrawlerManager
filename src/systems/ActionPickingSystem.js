import {
  defineQuery,
  hasComponent
} from "bitecs"
import Phaser from "phaser"

//components
import { Action } from "../components/Action" 
import { BattleUnit } from "../components/BattleUnit" 
import { Position } from "../components/Position" 
import { Dead } from "../components/Dead"


import { ActionType } from "../components/Action" 

import { EventCenter } from "../helpers/EventCenter" 

export const createActionPickingSystem=(world)=>{
  const unitQuery=defineQuery([Action, BattleUnit])
  
  const aggroRange = world.scene.level.cellSize*1.3
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{
      if (hasComponent(world, Dead, id))
        return
      
      const hadTarget = Action.target[id] != 0 
      
      Action.target[id] = 0 
      unitQuery(world).forEach(otherId=>{
        
        

        if (otherId != id && BattleUnit.team[id] != BattleUnit.team[otherId] && !hasComponent(world, Dead, otherId)) {
          
          
          
          if (Phaser.Math.Distance.Between(
            Position.x[id],
            Position.y[id],
            Position.x[otherId],
            Position.y[otherId]
          ) < aggroRange) {
            
            if (BattleUnit.team[id] == 1 && !hadTarget) {
          
            EventCenter.emit("hostileUnitEngaged", { id })
            
          }
            
            BattleTarget.targetEntity[id] = otherId
          }
        }
        
      })
      
    })
    
    
    
    return world
  }
}