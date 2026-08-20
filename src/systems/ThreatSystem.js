import {
  defineQuery,
  hasComponent
} from "bitecs"

//components 

import { Position } from "../components/Position"
import { BattleUnit } from "../components/BattleUnit"
import { Dead } from "../components/Dead"

import { EventCenter } from "../helpers/EventCenter" 

//helpers
import { GlobalStuff } from "../helpers/GlobalStuff"

export const createThreatSystem=(world)=>{
  const unitQuery=defineQuery([BattleUnit])
  
  const onDamageRequest = (request) => {
    
  }
  
  const onDamageTaken = (event) =>{
    
  }
  
  const onHealRequest = (request) =>{
    
  }
  
  EventCenter.on("damageRequest", onDamageRequest, this)
  EventCenter.on("damageTaken", onDamageTaken, this)
  EventCenter.on("healRequest", onHealRequest, this)
  

  const aggroRange = world.scene.level.cellSize*2
  const aggroRangeSquared = aggroRange*aggroRange
  const proximityThreatMod = 1
  
  return (world, dt)=>{
    
    unitQuery(world).forEach(id=>{

      //Manage proximity and nearby friendlies
      if (!world.scene.threatData[id])
        world.scene.threatData[id] = {
          allies: [],
          hostile: {}
        }
      
      unitQuery(world).forEach(otherId=>{

        if (hasComponent(world, Dead, otherId)) {
          if (world.scene.threatData[id].allies.includes(otherId))
            world.scene.threatData[id].allies = world.scene.threatData[id].allies.filter(value=>(value=!otherId))
          else if (world.scene.threatData[id].hostile[otherId]) {
            delete world.scene.threatData[id].hostile[otherId]
            console.log(world.scene.threatData[id].hostile)
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
           
            if (!world.scene.threatData[id].hostile[otherId])
                world.scene.threatData[id].hostile[otherId] = {
                  proximity : 0,
                  attack : 0,
                  heal : 0
                }
            const dist = Phaser.Math.Distance.Between(
              Position.x[id],
              Position.y[id],
              Position.x[otherId],
              Position.y[otherId]
            )
            
            world.scene.threatData[id].hostile[otherId].proximity += (aggroRange-dist) * proximityThreatMod * dt
          }

        }
      })
      
    })
    
    
    
    return world
  }
}