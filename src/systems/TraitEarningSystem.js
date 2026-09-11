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
  
  
  
  const onHealReceived = (data) =>{
    if (data.target == data.source)
      return
      
    if (BattleUnit.team[data.source] !==0)
    return
      
    const preHealHitpoints = Attackable.currentHitpoints[data.target] - data.amount
    const preHealRatio = preHealHitpoints / Attackable.maxHitpoints[data.target]
    
    
    
    if (preHealRatio < .6) {
      EventCenter.emit("addTrait", {
        unitIndex: UnitIndex.index[data.source],
        traitIndex: TRAIT.NEVER_GONNA_GIVE_YOU_UP,
        reason: NameHelper.GetName(world, data.target) + " was saved with only " + Math.round(preHealRatio*100) +"% hitpoints left by a last minute heal from " + NameHelper.GetName(world, data.source)
      })
    }
    
  }
  
  EventCenter.on("unitWasHealed", onHealReceived)
  
  
  
  return (world, dt)=>{
    
    return world
  }
}

