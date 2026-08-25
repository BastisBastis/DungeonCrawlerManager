import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { Dead } from "../components/Dead"

import { EventCenter } from "../helpers/EventCenter" 
import { NameHelper } from "../helpers/NameHelper"  

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
        var damageTaken = randomDamage(minDamage, data.damage, data.atk, Attackable.armorClass[target])
        
        Attackable.currentHitpoints[target] = Math.floor(Math.max(0, Attackable.currentHitpoints[target] - damageTaken))
        
        EventCenter.emit("damageTaken", {
          damage: damageTaken,
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

