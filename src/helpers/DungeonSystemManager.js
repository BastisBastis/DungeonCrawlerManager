import { createActionPickingSystem } from "../systems/ActionPickingSystem"
import { createMeleeAttackSystem } from "../systems/MeleeAttackSystem" 
import { createTakeDamageSystem } from "../systems/TakeDamageSystem" 
import { createDeathSystem } from "../systems/DeathSystem"
import { createGraphicsSystem } from "../systems/GraphicsSystem" 
import { createCheckPointSystem } from "../systems/CheckpointSystem" 
import { createMovementSystem } from "../systems/MovementSystem" 
import { createGoalSystem } from "../systems/GoalSystem" 

export class DungeonSystemManager {
  constructor(world) {
    this.world=world
    
    createTakeDamageSystem(world)
    
    this.systems=[
      
      createCheckPointSystem(world),
      createActionPickingSystem(world),
      createMeleeAttackSystem(world),
      createMovementSystem(world),
      createGoalSystem(world),
      createDeathSystem(world),
      createGraphicsSystem(world)
    ]
  }
  
  update(dt) {
    this.systems.forEach(system=>{
      system(this.world, dt)
    })
  }
}