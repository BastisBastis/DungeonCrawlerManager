import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { BattleTarget } from "../components/BattleTarget" 
import { BattleUnit } from "../components/BattleUnit" 
import { Position2d } from "../components/Position2d" 
import { Dead } from "../components/Dead"


import { EventCenter } from "../helpers/EventCenter" 

export const createTargetPickingSystem=(world)=>{
  const unitQuery=defineQuery([BattleTarget, BattleUnit])
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{
      BattleTarget.targetEntity[id] = 0 
      unitQuery(world).forEach(otherId=>{
        
        

        if (otherId != id && BattleUnit.team[id] != BattleUnit.team[otherId] && !hasComponent(world, Dead, otherId)) {
          if (BattleTarget.targetEntity[id] != otherId) {
           // EventCenter.emit("addLogMessage", id + " found a target: " + otherId)
          }
          BattleTarget.targetEntity[id] = otherId
        }
        
      })
      
    })
    
    
    
    return world
  }
}