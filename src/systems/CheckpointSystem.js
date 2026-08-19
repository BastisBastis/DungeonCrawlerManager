import {
    addComponent,
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Position } from "../components/Position"
import { CheckpointFollower } from "../components/CheckpointFollower" 



export const createCheckPointSystem=(world)=>{
  const query=defineQuery([CheckpointFollower, Position])
  
  return (world, dt)=>{
    
    const checkpoints = world.scene.level.checkPoints
    

    query(world).forEach(id=>{
      var index = CheckpointFollower.index[id]
      
      if (index>=checkpoints.length)
        return
        
      const cellSize = world.scene.level.cellSize
      
      var col = Math.floor((Position.x[id] + cellSize/2) /cellSize)
      var row = Math.floor((Position.y[id] + cellSize/2) /cellSize)
      
      if (col == checkpoints[index].x && row == checkpoints[index].y && index < checkpoints.length -1) {
        CheckpointFollower.index[id] += 1
        
      }
        
      
    })

    
    
    
    return world
  }
}