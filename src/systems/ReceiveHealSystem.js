import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { Dead } from "../components/Dead"
import { UnitIndex } from "../components/UnitIndex" 

import { EventCenter } from "../helpers/EventCenter" 


export const createReceiveHealSystem=(world)=>{
  
  EventCenter.on("healRequest", (request)=>{
    const source = request.source
    const target = request.target
    const data = request.data

    if (hasComponent(world, Dead, target))
      return
    
    

    if (hasComponent(world,Attackable, target) && !hasComponent(world, Dead, source)) {
      
      Attackable.currentHitpoints[target] = Math.min(Attackable.currentHitpoints[target] + data.amount, Attackable.maxHitpoints[target])
      
      EventCenter.emit("addLogMessage", target + " receives " + data.amount + " heal from " + source)
      EventCenter.emit("updateHitpoints", {
        id: target,
        currentHitpoints: Attackable.currentHitpoints[target],
        maxHitpoints: Attackable.maxHitpoints[target]
      })
      
      EventCenter.emit("unitWasHealed", {
        target,
        source,
        amount: data.amount
      })
      
    }
        
    
  })
  
  const heroQuery = defineQuery([UnitIndex])
  
  EventCenter.on("timeOutHeal",()=>{
    //console.log(1)
    heroQuery(world).forEach(id=>{
      if (!hasComponent(world, Dead, id)) {
        
        Attackable.currentHitpoints[id] = Math.min(
          Attackable.currentHitpoints[id] + Attackable.maxHitpoints[id] /2,
          Attackable.maxHitpoints[id]
        )
        
        EventCenter.emit("updateHitpoints", {
        id,
        currentHitpoints: Attackable.currentHitpoints[id],
        maxHitpoints: Attackable.maxHitpoints[id]
      })
        
      }
    })
  })
  
  
  return (world, dt)=>{
    
    return world
  }
}

