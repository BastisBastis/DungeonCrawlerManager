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

export const createMovementSystem=(world)=>{
  const query=defineQuery([Position])
  
  return (world, dt)=>{
    
    const checkpoints = world.scene.level.checkPoints
    const speed = 4
    
    const meleeRange = 10
    

    query(world).forEach(id=>{
      if (hasComponent(world, Dead, id))
        return
      
      var movementTarget = null
      
      if (hasComponent(world, CheckpointFollower, id)) {
        if (CheckpointFollower.index[id] < checkpoints.length) {
          var checkpoint = checkpoints[CheckpointFollower.index[id]]
          movementTarget = {
            x: checkpoint.x*world.scene.level.cellSize,
            y:checkpoint.y*world.scene.level.cellSize,
          }
        }
      }
      
      if (hasComponent(world, Action, id) && Action.target[id] != 0) {
        
        const targetPos = {
          x: Position.x[Action.target[id]],
          y: Position.y[Action.target[id]]
        }
        
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
      
      
      if (movementTarget) {
        
        
        const angle = Phaser.Math.Angle.Between(
          Position.x[id], 
          Position.y[id], 
          movementTarget.x, 
          movementTarget.y
        )

         Position.x[id]  = Position.x[id]  + Math.cos(angle) * speed;
         Position.y[id]  = Position.y[id]  + Math.sin(angle) * speed;
              }
        
      
    })

    
    
    
    return world
  }
}