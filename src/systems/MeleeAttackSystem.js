import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Action } from "../components/Action" 
import { MeleeAttack } from "../components/MeleeAttack" 
import { Position } from "../components/Position"
import { Dead } from "../components/Dead"

import { ActionType } from "../components/Action"

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

export const createMeleeAttackSystem=(world)=>{
  const unitQuery=defineQuery([Action, MeleeAttack])
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
      MeleeAttack.coolDown[id] += dt/100
      if (Action.action[id] == ActionType.ATTACK && !hasComponent(world, Dead, id) && Action.target[id] != 0 && !hasComponent(world, Dead, Action.target[id]) && MeleeAttack.coolDown[id] >= MeleeAttack.delay[id]) {
        
        MeleeAttack.coolDown[id] -= MeleeAttack.delay[id] 
        
        EventCenter.emit("damageRequest", {
          source:id,
          target: Action.target[id],
          damageType: "melee",
          data: {
            atk: MeleeAttack.atk[id],
            damage: MeleeAttack.damage[id]
          }
        })
        
        if (GlobalStuff.verboseLog >=2)
        EventCenter.emit("addLogMessage", id + " requests " + MeleeAttack.damage[id] + " dmg to " + Action.target[id])
        
      }
      
    })
    
    
    
    return world
  }
}