import {
  defineQuery,
  hasComponent
} from "bitecs"

//components 

import { Position } from "../components/Position"
import { BattleUnit } from "../components/BattleUnit"

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

export const createThreatSystem=(world)=>{
  const unitQuery=defineQuery([BattleUnit])
  
  const threat = {}
  
  const getThreatForId(id) {
    return threat[id]
  }
  
  const onDamageRequest = (request) => {
    
  }
  
  const onDamageTaken = (event) =>{
    
  }
  
  const onHealRequest = (request) =>{
    
  }
  
  EventCenter.on("damageRequest", onDamageRequest, this)
  EventCenter.on("damageTaken", onDamageTaken, this)
  EventCenter.on("healRequest", onHealRequest, this)
  
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
      /*
        EventCenter.emit("damageRequest", {
          source:id,
          target: Action.target[id],
          damageType: "melee",
          data: {
            atk: MeleeAttack.atk[id],
            damage: MeleeAttack.damage[id]
          */
      
    })
    
    
    
    return world
  }
}