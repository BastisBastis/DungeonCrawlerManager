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


const cellCenterX = checkpoints[index].x * cellSize
const cellCenterY = checkpoints[index].y * cellSize

if (
  Math.abs(Position.x[id] - cellCenterX) <= cellSize * 0.25 &&
  Math.abs(Position.y[id] - cellCenterY) <= cellSize * 0.25
) {
  CheckpointFollower.index[id] += 1
  return
}
return

      
      var col = Math.floor((Position.x[id] + cellSize/2) /cellSize)
      var row = Math.floor((Position.y[id] + cellSize/2) /cellSize)
      
      if (col == checkpoints[index].x && row == checkpoints[index].y && index < checkpoints.length -1) {
        CheckpointFollower.index[id] += 1
        
      }
        
      
    })

    
    
    
    return world
  }
}