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
  
  const performAttack = (source, target, atk, damage) => {
    
    if (hasComponent(world, Dead, source) || hasComponent(world, Dead, target))
      return
    
    EventCenter.emit("damageRequest", {
      source:source,
      target: target,
      damageType: "melee",
      data: {
        atk: atk,
        damage: damage
      }
    })
  }
  
  const unitQuery=defineQuery([Action, MeleeAttack])
  const attackRange = world.scene.level.cellSize
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
    MeleeAttack.coolDown[id] = Math.min(MeleeAttack.coolDown[id] + dt/100, MeleeAttack.delay[id])
      
      
      
      if (Action.action[id] == ActionType.ATTACK && !hasComponent(world, Dead, id) && Action.target[id] != 0 && !hasComponent(world, Dead, Action.target[id]) && MeleeAttack.coolDown[id] >= MeleeAttack.delay[id]) {
        
        const targetPos = {
          x: Position.x[Action.target[id]],
          y: Position.y[Action.target[id]]
        }

        const distSquared = Phaser.Math.Distance.Squared(
          Position.x[id],
          Position.y[id],
          targetPos.x,
          targetPos.y
        )

        if (distSquared > attackRange*attackRange)
          return

        MeleeAttack.coolDown[id] -= MeleeAttack.delay[id] 
        
        EventCenter.emit("meleeAttack", id)
        
        setTimeout(()=>{
          performAttack(
            id, 
            Action.target[id],
            MeleeAttack.atk[id],
            MeleeAttack.damage[id]
          )
        }, MeleeAttack.buildUpTime[id])
        
        if (GlobalStuff.verboseLog >=2)
        EventCenter.emit("addLogMessage", id + " requests " + MeleeAttack.damage[id] + " dmg to " + Action.target[id])
        
      }
      
    })
    
    
    
    return world
  }
}