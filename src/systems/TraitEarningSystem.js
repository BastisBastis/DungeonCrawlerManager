import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { BattleUnit } from "../components/BattleUnit" 
import { UnitIndex } from "../components/UnitIndex" 
import { ClassType, ClassIdFromName, ClassIds } from "../components/ClassType" 




import { EventCenter } from "../helpers/EventCenter" 


//Helpers
import { NameHelper } from "../helpers/NameHelper" 
import { Store } from "../helpers/Store" 
import * as Utils from "../helpers/Utils" 


//Data
import { TRAIT } from "../data/Traits" 



export const createTraitEarningSystem=(world)=>{
  
  
  
  
  
  const playerUnitQuery=defineQuery([UnitIndex])
  
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
    //console.log(playerUnitQuery)
    playerUnitQuery(world).forEach(id=> {
      if (hasComponent(world, Attackable, id)) {
        const healthRatio = Attackable.currentHitpoints[id] / Attackable.maxHitpoints[id]
        if (healthRatio < .3) {
          //console.log(id, NameHelper.GetName(world, id), hasComponent(world, UnitIndex, id))
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
      
      if (damage/maxDamage >= .9 && Math.random()>.15) {
        
        
        EventCenter.emit("addTrait", {
            unitIndex: UnitIndex.index[source],
            traitIndex: TRAIT.SADIST,
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

export const addRandomTrait = (world, id) => {
  
  const unitIndex = UnitIndex.index[id]
  
  
  
  
    var traitIds = [
      TRAIT.PROUD,
      TRAIT.BLOODTHIRSTY,
      TRAIT.SPIKED_SKIN,
      TRAIT.RECKLESS,
      TRAIT.SPRAINED_ANKLE,
      TRAIT.HARD_HITTER,
      TRAIT.QUICK_HANDS,
      TRAIT.GREEDY,
      TRAIT.GOLD_DIGGER,
      TRAIT.NERVOUS
    ]
    
    const unitClass = Store.run.units[unitIndex].classType
    
    
    
    if (unitClass === ClassType.WARRIOR) {
      
      traitIds.push(
        ...[
          TRAIT.LEADER,
          TRAIT.PROTECTIVE,
          TRAIT.BULKY
        ]
      )
    }
    if (unitClass === ClassType.ROGUE) {
      
      traitIds.push(
        ...[
          TRAIT.LEROY_JENKINS
        ]
      )
    }
    if (unitClass === ClassType.CLERIC) {
      
      traitIds.push(
        ...[
          TRAIT.POSSESSIVE
        ]
      )
    }
    
    traitIds = traitIds.filter(traitId=>{
      return !Store.run.units[unitIndex].traits.includes(traitId)
    })
    
    //console.log(traitIds, traitIds.length)
    
    if (traitIds.length <= 0)
      return
    
    const traitIndex = traitIds[Utils.getRandomInt(0, traitIds.length)]
    //console.log("trait index: "+traitIndex)
    
    console.log("trait index: " + traitIndex)
    
    EventCenter.emit("addTrait", {
        unitIndex: unitIndex,
        traitIndex,
        reason: NameHelper.GetName(world, id) + " came back from the dungeon slightly altered!"
    })
    
    
  }


