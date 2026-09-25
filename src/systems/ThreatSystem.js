import {
  defineQuery,
  hasComponent
} from "bitecs"

//components 

import { Position } from "../components/Position"
import { BattleUnit } from "../components/BattleUnit"
import { Dead } from "../components/Dead"
import { ThreatMod } from "../components/ThreatMod" 
import { Tactics } from "../components/Tactics" 
import { Traits } from "../components/Traits" 


import { EventCenter } from "../helpers/EventCenter" 


//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"
import { NameHelper } from "../helpers/NameHelper" 

//Data
import { TacticsMods } from "../data/Tactics" 
import { TraitList } from "../data/Traits" 

const unitQuery=defineQuery([BattleUnit])

const getTacticsThreatMod =(world, id) => {
  if (hasComponent(world, Tactics, id)) {
    //console.log("Tactics threat mod: " + TacticsMods[Tactics.index[id]].threat)
    
    var tacticsMod = TacticsMods[Tactics.index[id]].threat
    
    
    if (hasComponent(world, Traits, id)) {
            
      for (let i = 0; i < Traits.count[id]; i++) {
        const traitIndex = Traits.traits[id][i]
        const trait = TraitList[traitIndex]
        for (const effect of trait.effects) {
          
          if (effect.type == "tacticsModifier") {
            
            tacticsMod = Math.pow(tacticsMod, effect.mod)
              
            
          }
          
        }
        
      }
    }
    
    
    return tacticsMod
  }
  return 1.0
}

export const getAlliesInRange = (world, id) => {
  
  
  const allyRange = world.scene.level.cellSize*1
  const alliesInRange = []
  
  unitQuery(world).forEach((otherId)=>{
    
    if (id != otherId && BattleUnit.team[id] == BattleUnit.team[otherId]) {
      const distSquared = Phaser.Math.Distance.Squared(
        Position.x[id],
        Position.y[id],
        Position.x[otherId],
        Position.y[otherId]
      )
      if (distSquared <= allyRange*allyRange) {
        alliesInRange.push(otherId)
      }
    }
  })
  
  return alliesInRange
  
}

export const createThreatSystem=(world)=>{
  
  const aggroRange = world.scene.level.cellSize*2
  const aggroRangeSquared = aggroRange*aggroRange
  const proximityThreatMod = .1
  const damageRequestMod = 10
  const damageTakenMod = 15
  const healThreatMod = 1.7
  
  const hostileDataStructure = {
    proximity : 0,
    attack : 0,
    heal : 0,
    other : 0
  }
  
  const checkFriendlyThreat = (a, b, event) => {
    if (BattleUnit.team[a] === BattleUnit.team[b]) {
      //console.log("FRIENDLY THREAT - " + event)
      return true
    }
    return false
  }
  
  
  const setupThreatData =(id) => {
    if (!world.scene.threatData[id])
      world.scene.threatData[id] = {
        allies: [],
        hostile: {}
      }
  }
  
  const setupHostileThreatData =(id, otherId)=> {
    if (!world.scene.threatData[id].hostile[otherId])
      world.scene.threatData[id].hostile[otherId] = { ...hostileDataStructure }
        
  }
  
  const onDamageRequest = (req) => {
    setupThreatData(req.target)
    setupHostileThreatData(req.target, req.source)
    
    var threatMod = 1.0
    if (hasComponent(world, ThreatMod,req.source)) {
      threatMod *= ThreatMod.attack[req.source]
    }
    
    threatMod *= getTacticsThreatMod(world, req.source)
    
    world.scene.threatData[req.target].hostile[req.source].attack += req.data.damage * damageRequestMod * threatMod
  }
  
  const onDamageTaken = (event) =>{
    const threatUnits = [
      ...getAlliesInRange(world, event.target),
      event.target
      
    ]
    threatUnits.forEach(id=>{
      setupThreatData(id)
      setupHostileThreatData(id, event.source)
      
      var threatMod = 1.0
      if (hasComponent(world, ThreatMod,event.source)) {
        threatMod *= ThreatMod.attack[event.source]
      }
      
      threatMod *= getTacticsThreatMod(world, event.source)
      
      world.scene.threatData[id].hostile[event.source].attack += event.damage * damageTakenMod * threatMod
    })
  }
  
  const onHealRequest = (req) =>{
    unitQuery(world).forEach(id=>{
      
    
      if (world.scene.threatData[id] && world.scene.threatData[id].hostile[req.target]) {
        
        var threatMod = 1.0
        if (hasComponent(world, ThreatMod,req.source)) {
          threatMod *= ThreatMod.heal[req.source]
        }
        threatMod *= getTacticsThreatMod(world, req.source)
        
        
        setupHostileThreatData(id, req.source)
          
        world.scene.threatData[id].hostile[req.source].heal += req.data.amount * healThreatMod * threatMod
        
      }
      
    })
  }
  
  const logThreat=() => {
    console.log("--------Threat data dump--------")
    Object.keys(world.scene.threatData).forEach(id=>{
      console.log(NameHelper.GetName(world, id))
      console.log(world.scene.threatData[id].hostile)
    })
  }
  
  EventCenter.on("damageRequest", onDamageRequest, this)
  EventCenter.on("damageTaken", onDamageTaken, this)
  EventCenter.on("healRequest", onHealRequest, this)
  EventCenter.on("logThreat", logThreat, this)
  

  
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{

      //Manage proximity and nearby friendlies
      setupThreatData(id)
      
      unitQuery(world).forEach(otherId=>{

        if (hasComponent(world, Dead, otherId)) {
          if (world.scene.threatData[id].allies.includes(otherId))
            world.scene.threatData[id].allies = world.scene.threatData[id].allies.filter(value=>(value!=otherId))
          else if (world.scene.threatData[id].hostile[otherId]) {
            delete world.scene.threatData[id].hostile[otherId]
            
          }
          return
        }

        const distSquared = Phaser.Math.Distance.Squared(
          Position.x[id],
          Position.y[id],
          Position.x[otherId],
          Position.y[otherId]
        )

        if (distSquared <= aggroRangeSquared) {
          

          if (BattleUnit.team[id] == BattleUnit.team[otherId]) {
            if (!world.scene.threatData[id].allies.includes(otherId))
                world.scene.threatData[id].allies.push(otherId)
          } else {
            //Other team
           
            setupHostileThreatData(id,otherId)
            const dist = Phaser.Math.Distance.Between(
              Position.x[id],
              Position.y[id],
              Position.x[otherId],
              Position.y[otherId]
            )
            
            var threatMod = 1.0
            if (hasComponent(world, ThreatMod,otherId)) {
              threatMod *= ThreatMod.proximity[otherId]
            }
            
            world.scene.threatData[id].hostile[otherId].proximity = (aggroRange-dist) * proximityThreatMod * threatMod
          }

        }
      })
      
    })
    
    
    
    return world
  }
}