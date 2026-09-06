import { createActionPickingSystem } from "../systems/ActionPickingSystem"
import { createMeleeAttackSystem } from "../systems/MeleeAttackSystem" 
import { createTakeDamageSystem } from "../systems/TakeDamageSystem" 
import { createDeathSystem } from "../systems/DeathSystem"
import { createGraphicsSystem } from "../systems/GraphicsSystem" 
import { createCheckPointSystem } from "../systems/CheckpointSystem" 
import { createMovementSystem } from "../systems/MovementSystem" 
import { createGoalSystem } from "../systems/GoalSystem" 
import { createHealingSystem } from "../systems/HealingSystem"
import { createReceiveHealSystem } from "../systems/ReceiveHealSystem"
import { createThreatSystem } from "../systems/ThreatSystem" 
import { createAnimationSystem } from "../systems/AnimationSystem"
import { createParticleSystem } from "../systems/ParticleSystem"
import { createStatSystem } from "../systems/StatSystem" 

export class DungeonSystemManager {
  constructor(world) {
    this.world=world
    
    createTakeDamageSystem(world)
    createReceiveHealSystem(world)
    
    
    this.systems=[
      
      createCheckPointSystem(world),
      createThreatSystem(world),
      createActionPickingSystem(world),
      createMeleeAttackSystem(world),
      createHealingSystem(world),
      createMovementSystem(world),
      createGoalSystem(world),
      createDeathSystem(world),
      createParticleSystem(world),
      createGraphicsSystem(world),
      createAnimationSystem(world),
      createStatSystem(world)
    ]
  }
  
  update(dt) {
    
    var lastTime
    var i = 0
    this.systems.forEach(system=>{
      lastTime = Date.now()
      system(this.world, dt)
      const elapsed = Date.now()-lastTime
      if (elapsed > 30)
        console.log("dt "+ elapsed + " system: " + i)
        i++
    })
  }
}