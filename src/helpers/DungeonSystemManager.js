import { createTargetPickingSystem } from "../systems/TargetPickingSystem"
import { createMeleeAttackSystem } from "../systems/MeleeAttackSystem" 
import { createTakeDamageSystem } from "../systems/TakeDamageSystem" 

export class DungeonSystemManager {
  constructor(world) {
    this.world=world
    
    createTakeDamageSystem(world)
    
    this.systems=[
      
      createTargetPickingSystem(world),
      createMeleeAttackSystem(world)
    ]
  }
  
  update(dt) {
    this.systems.forEach(system=>{
      system(this.world, dt)
    })
  }
}