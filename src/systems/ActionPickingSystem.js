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
  
  const aggroRange = world.scene.level.cellSize*2
  const healTargetFindingRange = world.scene.level.cellSize*2
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{
      if (hasComponent(world, Dead, id))
        return
      
      
      const oldTarget = Action.target[id]
      const hadTarget = Action.target[id] != 0 
      
      const checkUpdatedTarget=() => {
        //console.log("checkTarget", Action.target[id], oldTarget)
        if (Action.target[id] != oldTarget) {
          EventCenter.emit("targetUpdated", {
            id,
            target: Action.target[id]
          })
          
        }
      }
      
      Action.target[id] = 0 
      Action.action[id] = ActionType.IDLE
      
      const potentialHealTargets = []
      
      unitQuery(world).forEach(otherId=>{
        
        
        if (hasComponent(world, Healer, id) && Healer.coolDown[id] >= Healer.delay[id]) {
          

          
          if (BattleUnit.team[id] == BattleUnit.team[otherId] ) {
            const distSquared = Phaser.Math.Distance.Squared(
              Position.x[id],
              Position.y[id],
              Position.x[otherId],
              Position.y[otherId]
            )
            if (distSquared <= healTargetFindingRange*healTargetFindingRange && Attackable.currentHitpoints[otherId] < Attackable.maxHitpoints[otherId]) {
              potentialHealTargets.push(otherId)
            }
          }
          

        
          return

        }
        
        
        if (hasComponent(world, MeleeAttack, id)) 
          {
          var highestThreatId = 0
          var highestThreatValue = -1
          if (!world.scene.threatData[id])
            return
          for (const [otherId, threatData] of Object.entries(world.scene.threatData[id].hostile)) {
            var totalValue = 0
            for (const threatValue of Object.values(threatData)) {
              totalValue += threatValue
            }
            if (totalValue > highestThreatValue) {
              highestThreatValue = totalValue
              highestThreatId = otherId
            }
          }
          if (highestThreatValue > 0) {
            //console.log(highestThreatId, highestThreatValue)
          }
          if (highestThreatId > 0) {
            if (BattleUnit.team[id] == 1 && !hadTarget) {
              EventCenter.emit("hostileUnitEngaged", { id })
            }
            if (Action.target[id] != oldTarget) {
              EventCenter.emit("targetUpdated", {
                id,
                target: highestThreatId
              })
            }
            Action.target[id] = highestThreatId
            Action.action[id] = ActionType.ATTACK
            checkUpdatedTarget()
            return
          }
          
        }
      })
      
      potentialHealTargets.sort((a, b)=>{
        return Attackable.currentHitpoints[a] / Attackable.maxHitpoints[a] > Attackable.currentHitpoints[b] / Attackable.maxHitpoints
      })
      
      if (potentialHealTargets.length > 0) {
            
        Action.target[id] = potentialHealTargets[0]
        Action.action[id] = ActionType.HEAL
        checkUpdatedTarget()
        return
      }
      
      checkUpdatedTarget()
    })
    
    
    
    
    return world
  }
}