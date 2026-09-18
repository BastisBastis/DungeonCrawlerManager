import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { Dead } from "../components/Dead"
import { Traits } from "../components/Traits"

import { EventCenter } from "../helpers/EventCenter" 
import { NameHelper } from "../helpers/NameHelper"  
import { UnitIndex } from "../components/UnitIndex" 
import { Tactics } from "../components/Tactics" 

import { TraitList, CheckTraitCondition } from "../data/Traits"
import { TacticsMods } from "../data/Tactics" 

const randomDamage = (min, max, attackSkill, armorClass) => {
    const difference = attackSkill - armorClass

    
    const strength = 10

    // 0 = min, 0.5 = mid, 1 = max
    const center = Math.max(
        0,
        Math.min(1, 0.5 + difference / (2 * strength))
    )

    
    const roll =
        (Math.random() +
         Math.random() +
         Math.random() +
         Math.random() +
         Math.random() +
         Math.random()) / 6;

    // spread = 0.0 - 1.0
    const spread = 0.5;

    const value = center + (roll - 0.5) * spread;

    return Math.round(
        min + (max - min) * Math.max(0, Math.min(1, value))
    );
}; 

export const createTakeDamageSystem=(world)=>{
  
  const playerUnitQuery = defineQuery([UnitIndex])
  
  EventCenter.on("damageRequest", (request)=>{
    const source = request.source
    const target = request.target
    const damageType = request.damageType
    const data = request.data

    if (hasComponent(world, Dead, target))
      return
    
    
    if (damageType == "melee") {
      if (hasComponent(world,Attackable, target) && !hasComponent(world, Dead, source)) {
        const minDamage = data.damage * 0.2
        
        var armorClass = Attackable.armorClass[target]
        var atk = data.atk
        if (hasComponent(world, Tactics, target)) {
          armorClass *= TacticsMods[Tactics.index[target]].defense
          //console.log("using defense tactics")
        }
        
        if (hasComponent(world, Tactics, source)) {
          atk *= TacticsMods[Tactics.index[source]].damage
          //console.log("usikg offensive tactics")
        }
        
        
        var damageTaken = randomDamage(minDamage, data.damage, atk, armorClass)

        var traitMod = 1.0

        if (hasComponent(world, Traits, target)) {
                  
          for (let i = 0; i < Traits.count[target]; i++) {
            const traitIndex = Traits.traits[target][i]
            const trait = TraitList[traitIndex]
            for (const effect of trait.effects) {
              if (effect.type == "damageMitigation") {
                if (effect.condition && CheckTraitCondition({
                  world, 
                  id: target,
                  effect
                })) {
                  traitMod *= effect.mod
                 
                  //console.log("DAMAGE REDUCTION FROM TRAIT", damageTaken, damageTaken*traitMod)
                }
              }
            }
            
          }
        }
        if (hasComponent(world, Traits, source)) {
                  
          for (let i = 0; i < Traits.count[source]; i++) {
            const traitIndex = Traits.traits[source][i]
            const trait = TraitList[traitIndex]
            for (const effect of trait.effects) {
              
              if (effect.type == "damageModifier") {
                if (effect.condition && CheckTraitCondition({
                  world, 
                  target: target,
                  effect
                })) {
                  traitMod *= effect.mod
                  console.log("Damage increased from trait. TraitMod: " + traitMod)
                 
                }
              }
              
            }
            
          }
        }
        
        if (hasComponent(world, UnitIndex, target)) {
          
          playerUnitQuery(world).forEach(id=>{
            if (id == target)
              return 
              
            if (hasComponent(world, Traits, id)) {
                  
              for (let i = 0; i < Traits.count[id]; i++) {
                const traitIndex = Traits.traits[id][i]
                const trait = TraitList[traitIndex]
                
                for (const effect of trait.effects) {
                  
                  if (effect.type == "protect") {
                    const protectorDamage = damageTaken * traitMod * effect.mod
                    traitMod *= (1-effect.mod)
                    
                    Attackable.currentHitpoints[id] = Math.floor(Math.max(0, Attackable.currentHitpoints[id] - protectorDamage))
                    
                    EventCenter.emit("damageTaken", {
                      damage: protectorDamage,
                      maxDamage: data.damage,
                      id,
                      source,
                      damageType: "protection"
                    })
                    
                    EventCenter.emit("updateHitpoints", {
                      id: id,
                      currentHitpoints: Attackable.currentHitpoints[id],
                      maxHitpoints: Attackable.maxHitpoints[id]
                    })
                    
                  }
                  
                }
                
                
              }
            }
            
          })
          
        }
        
        
        damageTaken *= traitMod
        damageTaken = Math.round(damageTaken)
        
        Attackable.currentHitpoints[target] = Math.floor(Math.max(0, Attackable.currentHitpoints[target] - damageTaken))
        
        EventCenter.emit("damageTaken", {
          damage: damageTaken,
          maxDamage: data.damage,
          target,
          source,
          damageType
        })
        
        EventCenter.emit("addLogMessage", 
          NameHelper.GetName(world,source) + " does " + 
          damageTaken + " damage (max: " 
          + data.damage + ") to " + 
          NameHelper.GetName(world, target))
          
        EventCenter.emit("updateHitpoints", {
          id: target,
          currentHitpoints: Attackable.currentHitpoints[target],
          maxHitpoints: Attackable.maxHitpoints[target]
        })
      }
        
    }
  })
  
  
  
  return (world, dt)=>{
    
    return world
  }
}

