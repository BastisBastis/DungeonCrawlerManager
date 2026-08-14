import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { BattleTarget } from "../components/BattleTarget" 
import { MeleeAttack } from "../components/MeleeAttack" 
import { Position2d } from "../components/Position2d"
import { Dead } from "../components/Dead"

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

export const createMeleeAttackSystem=(world)=>{
  const unitQuery=defineQuery([BattleTarget, MeleeAttack])
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
      MeleeAttack.coolDown[id] += dt/100
      if (!hasComponent(world, Dead, id) && BattleTarget.targetEntity[id] != 0 && !hasComponent(world, Dead, BattleTarget.targetEntity[id]) && MeleeAttack.coolDown[id] >= MeleeAttack.delay[id]) {
        
        MeleeAttack.coolDown[id] -= MeleeAttack.delay[id] 
        
        EventCenter.emit("damageRequest", {
          source:id,
          target: BattleTarget.targetEntity[id],
          damageType: "melee",
          data: {
            atk: MeleeAttack.atk[id],
            damage: MeleeAttack.damage[id]
          }
        })
        if (GlobalStuff.verboseLog >=2)
        EventCenter.emit("addLogMessage", id + " requests " + MeleeAttack.damage[id] + " dmg to " + BattleTarget.targetEntity[id])
        
      }
      
    })
    
    
    
    return world
  }
}