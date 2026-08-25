import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Action } from "../components/Action" 
import { Healer } from "../components/Healer" 
import { Dead } from "../components/Dead"

import { ActionType } from "../components/Action"

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

export const createHealingSystem=(world)=>{
  const unitQuery=defineQuery([Action, Healer])
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
      Healer.coolDown[id] += dt/100
      if (Action.action[id] == ActionType.HEAL && !hasComponent(world, Dead, id) && Action.target[id] != 0 && !hasComponent(world, Dead, Action.target[id]) && Healer.coolDown[id] >= Healer.delay[id]) {
        
        Healer.coolDown[id] -= Healer.delay[id] 
        
        EventCenter.emit("healRequest", {
          source:id,
          target: Action.target[id],
          data: {
            amount: Healer.amount[id]
          }
        })

        

        if (GlobalStuff.verboseLog >=2)
            EventCenter.emit("addLogMessage", id + " requests " + Healer.amount[id] + " heal to " + Action.target[id])
        
      }
      
    })
    
    
    
    return world
  }
}