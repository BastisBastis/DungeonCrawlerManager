import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Action } from "../components/Action" 
import { Healer } from "../components/Healer" 
import { Dead } from "../components/Dead"
import { Mana } from "../components/Mana"

import { ActionType } from "../components/Action"
import { Traits } from "../components/Traits"

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

//Data
import { TraitList, CheckTraitCondition } from "../data/Traits" 
import { Attackable } from "../components/Attackable"

export const createHealingSystem=(world)=>{
  const unitQuery=defineQuery([Action, Healer])
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
      Healer.coolDown[id] = Math.min(Healer.coolDown[id] + dt/100, Healer.delay[id])
      if (Action.action[id] == ActionType.HEAL && !hasComponent(world, Dead, id) && Action.target[id] != 0 && !hasComponent(world, Dead, Action.target[id]) && Healer.coolDown[id] >= Healer.delay[id]) {
        
        Healer.coolDown[id] -= Healer.delay[id] 

        if (hasComponent(world, Mana, id)) {
          
          
         
          Mana.currentMana[id] = Math.max(0, Mana.currentMana[id] - Math.floor(Healer.amount[id]/10))
          
          
          EventCenter.emit("manaUpdated", {
            id,
            currentMana: Mana.currentMana[id],
            maxMana: Mana.maxMana[id]
          })
        }
        
        
        var amount = Healer.amount[id]
        
        if (hasComponent(world, Traits, id)) {
          
          for (let i = 0; i < Traits.count[id]; i++) {
            const traitIndex = Traits.traits[id][i]
            const trait = TraitList[traitIndex]
            for (const effect of trait.effects) {
              
              if (effect.type == "healModifier") {
              
              
                if (effect.condition && CheckTraitCondition({
                  world, 
                  target: Action.target[id],
                  trait
                })) {
                  amount *= effect.mod
                  console.log("CRITICAL HEAL FROM TRAIT!")
                }
                
                
              }
              
            }
            
            
          }
          
        }
        
        
        
        EventCenter.emit("healRequest", {
          source:id,
          target: Action.target[id],
          data: {
            amount
          }
        })
        EventCenter.emit("playAudio",{
          key: "spell"
        })
        
        EventCenter.emit("unitIsCasting", id)

        EventCenter.emit("spawnParticles", {
          id,
          count:50
        })

        if (GlobalStuff.verboseLog >=2)
            EventCenter.emit("addLogMessage", id + " requests " + amount + " heal to " + Action.target[id])
        
      }
      
    })
    
    
    
    return world
  }
}