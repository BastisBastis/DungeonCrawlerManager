import {
  defineQuery,
  hasComponent
} from "bitecs"

import Phaser from "phaser"

//components
import { Attackable } from "../components/Attackable" 
import { BattleUnit } from "../components/BattleUnit" 
import { Action } from "../components/Action" 
import { MeleeAttack } from "../components/MeleeAttack" 
import { Position } from "../components/Position"
import { Dead } from "../components/Dead"

import { ActionType } from "../components/Action"
import { AttackAudio,  } from "../components/AttackAudio" 
import { Tactics } from "../components/Tactics" 
import { Traits } from "../components/Traits" 

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

//Data
import { TraitList } from "../data/Traits" 


export const createMeleeAttackSystem=(world)=>{
  
  const attackableQuery = defineQuery([Attackable])
  
  const performAttack = (source, target, atk, damage) => {
    
    if (hasComponent(world, Dead, source) || hasComponent(world, Dead, target))
      return
    
    const targets = [target]
    let damageMod = 1
    
    if (hasComponent(world, Traits, source)) {
      for (let i = 0; i < Traits.count[source]; i++) {
        for (const effect of TraitList[Traits.traits[source][i]].effects) {
          if (effect.type == "aoeAttack") {
            damageMod *= effect.mod
            attackableQuery(world).forEach(id=>{
              
              //console.log(effect, damageMod, effect.mod)
              
              const targetPos = {
                x: Position.x[id],
                y: Position.y[id]
              }
      
              const distSquared = Phaser.Math.Distance.Squared(
                Position.x[source],
                Position.y[source],
                targetPos.x,
                targetPos.y
              )
      
              if (
                id !== source &&
                id !== target &&
                BattleUnit.team[id] !== BattleUnit.team[source] &&
                distSquared < Math.pow(effect.range, 2)
                ) {
                  targets.push(id)
                  
                }
                
              
            })
          }
        }
      }
    }
    
    //console.log(targets.length)
    
    for (const tar of targets) {
      EventCenter.emit("damageRequest", {
        source:source,
        target: tar,
        damageType: "melee",
        data: {
          atk: atk,
          damage: damage * damageMod
        }
      })
    }
  }
    
  
  const playMeleeSound =(id)=> {
    EventCenter.emit("playAudio", {
      index: AttackAudio.audioKey[id]
    })
  }
  
  const unitQuery=defineQuery([Action, MeleeAttack])
  const attackRange = world.scene.level.cellSize
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{


      
    MeleeAttack.coolDown[id] = Math.min(MeleeAttack.coolDown[id] + dt/100, MeleeAttack.delay[id])
      
      
      
      if (Action.action[id] == ActionType.ATTACK && !hasComponent(world, Dead, id) && Action.target[id] != 0 && !hasComponent(world, Dead, Action.target[id]) && MeleeAttack.coolDown[id] >= MeleeAttack.delay[id]) {
        
        const targetPos = {
          x: Position.x[Action.target[id]],
          y: Position.y[Action.target[id]]
        }

        const distSquared = Phaser.Math.Distance.Squared(
          Position.x[id],
          Position.y[id],
          targetPos.x,
          targetPos.y
        )

        if (distSquared > attackRange*attackRange)
          return

        MeleeAttack.coolDown[id] -= MeleeAttack.delay[id] 
        
        EventCenter.emit("meleeAttack", id)
        
        const target = Action.target[id]
        
        
        EventCenter.emit("addTimedEvent", {
          time: MeleeAttack.buildUpTime[id],
          callback: ()=>{
            performAttack(
              id, 
              target,
              MeleeAttack.atk[id],
              MeleeAttack.damage[id]
            )
          }
        })
         EventCenter.emit("addTimedEvent", {
          time: AttackAudio.soundDelay[id],
          callback: ()=>{
            playMeleeSound(id)
          }
        })
        /*setTimeout(()=>{
          performAttack(
            id, 
            target,
            MeleeAttack.atk[id],
            MeleeAttack.damage[id]
          )
        }, MeleeAttack.buildUpTime[id])
        */
        if (GlobalStuff.verboseLog >=2)
        EventCenter.emit("addLogMessage", id + " requests " + MeleeAttack.damage[id] + " dmg to " + Action.target[id])
        
      }
      
    })
    
    
    
    return world
  }
}