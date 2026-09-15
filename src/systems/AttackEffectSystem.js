import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Traits } from "../components/Traits"
import { BattleUnit } from "../components/BattleUnit" 
import { UnitIndex } from "../components/UnitIndex" 
import { Mana } from "../components/Mana" 
import { Attackable } from "../components/Attackable" 


import { EventCenter } from "../helpers/EventCenter" 


//Helpers

import { Store } from "../helpers/Store" 
import * as Utils from "../helpers/Utils" 


//Data
import { TRAIT , TraitList} from "../data/Traits" 



export const createAttackEffectSystem=(world)=>{
  
  const playerUnitQuery=defineQuery([UnitIndex])
  
  const onDamageTaken = ({
    target, source, damage
  })=>{
    
    if (hasComponent(world, Traits, source) && hasComponent(world, UnitIndex, source)) {
      
      for (let i = 0; i < Traits.count[source]; i++) {
        
        const trait = TraitList[Traits.traits[source][i]]
        
        for (const effect of trait.effects) {
          
          if (effect.type == "lifeSteal") {
            var amount = 0
            if (effect.amount)
              amount = effect.amount
            else if (effect.percent)
              amount = effect.percent * damage
            
            
            EventCenter.emit("healRequest", {
              source,
              target: source,
              data: {
                amount
              }
            })
            
            
            
          } else if (effect.type == "manaSteal" && hasComponent(world, Mana, source)) {
            
            var amount = 0
            if (effect.amount)
              amount = effect.amount
            else if (effect.percent)
              amount = effect.percent * damage
            
            
            Mana.currentMana[source] = Math.min(Mana.currentMana[source] + amount, Mana.maxMana[source])
            
            EventCenter.emit("manaUpdated", {
              id: source,
              currentMana: Mana.currentMana[source],
              maxMana: Mana.maxMana[source]
            })
            
            
          } else if (effect.type == "selfAttackDamage") {
            
            var amount = 0
            if (effect.amount)
              amount = effect.amount
            else if (effect.percent)
              amount = effect.percent * damage
            
            Attackable.currentHitpoints[source] = Math.max(Attackable.currentHitpoints[source] - amount, 0)
            
            EventCenter.emit("updateHitpoints", {
            id: source,
            currentHitpoints: Attackable.currentHitpoints[source],
            maxHitpoints: Attackable.maxHitpoints[source]
            })
          }
          
        }
        
      }
    }
    
    
    if (hasComponent(world, Traits, target) && hasComponent(world, UnitIndex, target)) {
      
      for (let i = 0; i < Traits.count[target]; i++) {
        
        const trait = TraitList[Traits.traits[target][i]]
        
        for (const effect of trait.effects) {
          
          if (effect.type == "damageShield") {
          
            var amount = 0
            if (effect.amount)
              amount = effect.amount
            else if (effect.percent)
              amount = effect.percent * damage
              
            Attackable.currentHitpoints[source] = Math.max(Attackable.currentHitpoints[source] - amount, 0)
            
            
            
            EventCenter.emit("updateHitpoints", {
            id: source,
            currentHitpoints: Attackable.currentHitpoints[source],
            maxHitpoints: Attackable.maxHitpoints[source]
            })
          }
          
        }
        
        
        
      }
      
    }
    
    
  }
  
  
  EventCenter.on("damageTaken", onDamageTaken)
  
  return (world, dt)=>{
    
    return world
  }
  
}

