import {
  defineQuery,
  hasComponent
} from "bitecs"

//components 

import { Position } from "../components/Position"
import { BattleUnit } from "../components/BattleUnit"
import { Dead } from "../components/Dead"
import { ThreatMod } from "../components/ThreatMod" 


import { EventCenter } from "../helpers/EventCenter" 


//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"
import { NameHelper } from "../helpers/NameHelper" 

const unitQuery=defineQuery([BattleUnit])

export const getAlliesInRange = (world, id) => {
  
  const allyRange = world.scene.level.cellSize*3
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
  const proximityThreatMod = 1
  const damageRequestMod = 10
  const damageTakenMod = 15
  const healThreatMod = 20
  
  const hostileDataStructure = {
    proximity : 0,
    attack : 0,
    heal : 0,
    other : 0
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
  //EventCenter.on("damageTaken", onDamageTaken, this)
  EventCenter.on("healRequest", onHealRequest, this)
  EventCenter.on("logThreat", logThreat, this)
  

  
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{

      //Manage proximity and nearby friendlies
      setupThreatData(id)
      
      unitQuery(world).forEach(otherId=>{

        if (hasComponent(world, Dead, otherId)) {
          if (world.scene.threatData[id].allies.includes(otherId))
            world.scene.threatData[id].allies = world.scene.threatData[id].allies.filter(value=>(value=!otherId))
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