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
import { Healer } from "../components/Healer"


import { ActionType } from "../components/Action" 

import { EventCenter } from "../helpers/EventCenter" 
import { Attackable } from "../components/Attackable"
import { MeleeAttack } from "../components/MeleeAttack"

export const createActionPickingSystem=(world)=>{
  const unitQuery=defineQuery([Action, BattleUnit])
  const attackableBattleUnitQuery = defineQuery([BattleUnit, Attackable, Position])
  
  const aggroRange = world.scene.level.cellSize*1.3
  const healTargetFindingRange = world.scene.level.cellSize*2
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{
      if (hasComponent(world, Dead, id))
        return
    
      const hadTarget = Action.target[id] != 0 
      
      Action.target[id] = 0 
      Action.action[id] = ActionType.IDLE
      unitQuery(world).forEach(otherId=>{
        
        
        if (hasComponent(world, Healer, id)) {
          const potentialHealTargets = []

          attackableBattleUnitQuery(world).forEach(otherId=>{
            if (BattleUnit.team[id] == BattleUnit.team[otherId] && Healer.coolDown[id] >= Healer.delay[id]) {
              const dist = Phaser.Math.Distance.Between(
                Position.x[id],
                Position.y[id],
                Position.x[otherId],
                Position.y[otherId]
              )
              if (dist <= healTargetFindingRange && Attackable.currentHitpoints[otherId] < Attackable.maxHitpoints[otherId]) {
                potentialHealTargets.push(otherId)
              }
            }
            potentialHealTargets.sort((a, b)=>{
              return Attackable.currentHitpoints[a] / Attackable.maxHitpoints[a] > Attackable.currentHitpoints[b] / Attackable.maxHitpoints
            })
            if (potentialHealTargets.length > 0) {
              console.log("Healing target found")
              Action.target[id] = potentialHealTargets[0]
              Action.action[id] = ActionType.HEAL
              return
            }
          })

        }
        
        if (hasComponent(world, MeleeAttack, id)) 
          {
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
              
              Action.target[id] = otherId
              Action.action[id] = ActionType.ATTACK
            }
          }
        }
      })
      
    })
    
    
    
    return world
  }
}