import {
    addComponent,
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
  
  return (world, dt)=>{
    
    const checkpoints = world.scene.level.checkPoints
    const speed = 20
    
    const meleeRange = world.scene.level.cellSize*0.8
    

    query(world).forEach(id=>{
      if (hasComponent(world, Dead, id))
        return
      
      var movementTarget = null
      var lookTarget = null
      
      if (hasComponent(world, CheckpointFollower, id)) {
        if (CheckpointFollower.index[id] < checkpoints.length) {
          var checkpoint = checkpoints[CheckpointFollower.index[id]]
          movementTarget = {
            x: checkpoint.x*world.scene.level.cellSize,
            y:checkpoint.y*world.scene.level.cellSize,
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
        const dist = Phaser.Math.Distance.Between(
            Position.x[id],
            Position.y[id],
            targetPos.x,
            targetPos.y
          )
        if (dist < meleeRange) {
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

         Position.x[id]  = Position.x[id]  + Math.cos(angle) * speed*dt/100;
         Position.y[id]  = Position.y[id]  + Math.sin(angle) * speed*dt/100;
      }
      else {
        
        EventCenter.emit("unitIsIdle", id)
      }
        
      
    })

    
    
    
    return world
  }
}