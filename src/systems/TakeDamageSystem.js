import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { EventCenter } from "../helpers/EventCenter" 

export const createTakeDamageSystem=(world)=>{
  
  EventCenter.on("damageRequest", (request)=>{
    const source = request.source
    const target = request.target
    const damageType = request.damageType
    const data = request.data
    console.log(damageType)
    
    if (damageType == "melee") {
      if (hasComponent(world,Attackable, target)) {
        console.log(4)
        var damageTaken = Math.floor(data.damage * Math.random())
        
        Attackable.currentHitpoints[target] = Math.floor(Math.max(0, Attackable.currentHitpoints[target] - damageTaken))
        
        EventCenter.emit("addLogMessage", target + " takes " + damageTaken + " dmg (max: " + data.damage + ") - hps: " + Attackable.currentHitpoints[target]+"/" + Attackable.maxHitpoints[target])
      }
      
    
    
    }
  })
  
  
  
  return (world, dt)=>{
    
    return world
  }
}

