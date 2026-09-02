import {
    addComponent,
    enterQuery,
  defineQuery,
  hasComponent
} from "bitecs"

import Phaser from "phaser"

//components
import { Position } from "../components/Position"
import { CheckpointFollower } from "../components/CheckpointFollower" 
import { Action } from "../components/Action"
import { Dead } from "../components/Dead" 
import { Rotation } from "../components/Rotation"
import { EventCenter } from "../helpers/EventCenter"

export const createMovementSystem=(world)=>{
  const query=defineQuery([Position])
  const entryQuery = enterQuery(query)
  
  const offsets = [
    {
      x: 10,
      y: 0,
    },
    {
      x: -10,
      y: 0,
    },
    {
      x: 10,
      y: -10,
    },
    {
      x: -10,
      y: -10,
    },
  ]
  
  const unitOffsets={}
  
  return (world, dt)=>{
    
    
    
    const checkpoints = world.scene.level.checkPoints
    const speed = 14
    const separationRadius = world.scene.level.cellSize*0.2
    const meleeRange = world.scene.level.cellSize*0.4
    
    entryQuery(world).forEach(id=>{
      if (hasComponent(world, CheckpointFollower, id)) {
        
        unitOffsets[id] = offsets[Object.values(unitOffsets).length % offsets.length]
        //console.log(Object.values(unitOffsets.length) % offsets.length)
      }
    })
    

    query(world).forEach(id=>{
      if (hasComponent(world, Dead, id))
        return
      
      var movementTarget = null
      var lookTarget = null

      let separationX = 0
      let separationY = 0

      query(world).forEach(otherId=>{
        if (otherId === id) 
          return

        const dx = Position.x[id] - Position.x[otherId]
        const dy = Position.y[id] - Position.y[otherId]

        const distanceSq = dx * dx + dy * dy

        if (distanceSq < separationRadius * separationRadius && distanceSq > 0) {
            const distance = Math.sqrt(distanceSq)

            separationX += dx / distance
            separationY += dy / distance
        }
        //if (separationX != 0) console.log(separationX, separationY)
      })
      
      if (hasComponent(world, CheckpointFollower, id)) {
        if (CheckpointFollower.index[id] < checkpoints.length) {
          var checkpoint = checkpoints[CheckpointFollower.index[id]]
          movementTarget = {
            x: checkpoint.x*world.scene.level.cellSize + unitOffsets[id].x,
            y:checkpoint.y*world.scene.level.cellSize + unitOffsets[id].y,
          }
          lookTarget = movementTarget
        }
      }
      
      if (hasComponent(world, Action, id) && Action.target[id] != 0) {
        
        const targetPos = {
          x: Position.x[Action.target[id]],
          y: Position.y[Action.target[id]]
        }

        

        lookTarget = targetPos
        const distSquared = Phaser.Math.Distance.Squared(
            Position.x[id],
            Position.y[id],
            targetPos.x,
            targetPos.y
          )
        if (distSquared < meleeRange*meleeRange) {
          movementTarget = null
        } else {
          movementTarget = targetPos
        }
        
        
      }
      
      if (lookTarget && hasComponent(world, Rotation, id)) {
        const radians = Phaser.Math.Angle.Between(
          Position.x[id], 
          Position.y[id], 
          lookTarget.x, 
          lookTarget.y
        )
        //const radians = angle * Math.PI / 180
        Rotation.radians[id] = -radians
      }
      
      if (movementTarget) {
        EventCenter.emit("unitIsRunning", id)
        
        const angle = Phaser.Math.Angle.Between(
          Position.x[id], 
          Position.y[id], 
          movementTarget.x, 
          movementTarget.y
        )

         const distSquared = Phaser.Math.Distance.Squared(
            Position.x[id],
            Position.y[id],
            movementTarget.x,
            movementTarget.y
          )
        if (distSquared < Math.pow(speed*dt/100,2)) {
          Position.x[id] = movementTarget.x
          Position.y[id] = movementTarget.y
        } else {
          Position.x[id]  = Position.x[id]  + Math.cos(angle) * speed*dt/100;
          Position.y[id]  = Position.y[id]  + Math.sin(angle) * speed*dt/100;
        }


      }
      else {
        
        EventCenter.emit("unitIsIdle", id)
      }
      Position.x[id]+=separationX*.3
      Position.y[id]+=separationY*.3

      
    })

    
    
    
    return world
  }
}