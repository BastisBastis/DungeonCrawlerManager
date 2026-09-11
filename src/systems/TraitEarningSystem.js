import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { BattleUnit } from "../components/BattleUnit" 
import { UnitIndex } from "../components/UnitIndex" 


import { EventCenter } from "../helpers/EventCenter" 


//Helpers
import { NameHelper } from "../helpers/NameHelper" 


//Data
import { TRAIT } from "../data/Traits" 

export const createTraitEarningSystem=(world)=>{
  
  const playerUnitQuery=defineQuery(UnitIndex)
  
  const onHealReceived = (data) =>{
    if (data.target == data.source)
      return
      
    if (BattleUnit.team[data.source] !==0)
    return
      
    const preHealHitpoints = Attackable.currentHitpoints[data.target] - data.amount
    const preHealRatio = preHealHitpoints / Attackable.maxHitpoints[data.target]
    
    
    
    if (preHealRatio < .2) {
      EventCenter.emit("addTrait", {
        unitIndex: UnitIndex.index[data.source],
        traitIndex: TRAIT.NEVER_GONNA_GIVE_YOU_UP,
        reason: NameHelper.GetName(world, data.target) + " was saved with only " + Math.round(preHealRatio*100) +"% hitpoints left by a last minute heal from " + NameHelper.GetName(world, data.source)+"!"
      })
    }
    
  }

  const onWillExitDungeon = (world) => {
    playerUnitQuery(world).forEach(id=> {
      if (hasComponent(world, Attackable, id)) {
        const healthRatio = Attackable.currentHitpoints[id] / Attackable.maxHitpoints[id]
        if (healthRatio < .3) {
          EventCenter.emit("addTrait", {
            unitIndex: UnitIndex.index[id],
            traitIndex: TRAIT.OH_NO_YOU_WONT,
            reason: NameHelper.GetName(world, id) + " managed to finish the dungeon with only " + Math.round(healthRatio*100) + "% hitpoints left!"
          })
        }

      }
    })
  }

  const onDamageTaken = ({target, damage, maxDamage, source}) => {

    if (Attackable.currentHitpoints[target] <= 0 && BattleUnit.team[source] == 0) {
      console.log(damage/maxDamage)
      if (damage/maxDamage >= .9) {
        EventCenter.emit("addTrait", {
            unitIndex: UnitIndex.index[source],
            traitIndex: TRAIT.JUST_GO_DOWN_ALREADY,
            reason: NameHelper.GetName(world, source) + " destroyed " + NameHelper.GetName(world, target) + " with a high damage killing blow!"
          })
      }
    }

  }
  
  EventCenter.on("unitWasHealed", onHealReceived)
  EventCenter.on("willExitDungeon", onWillExitDungeon)
  EventCenter.on("damageTaken", onDamageTaken)
  
  return (world, dt)=>{
    
    return world
  }
}

