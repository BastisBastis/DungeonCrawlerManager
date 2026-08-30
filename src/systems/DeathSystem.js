import {
    addComponent,
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Attackable } from "../components/Attackable"
import { BattleUnit } from "../components/BattleUnit"
import { Dead } from "../components/Dead"
import { UnitIndex } from "../components/UnitIndex"


import { EventCenter } from "../helpers/EventCenter" 

export const createDeathSystem=(world)=>{
  const unitQuery=defineQuery([Attackable])
  
  return (world, dt)=>{
    
    var alives = [0,0]

    var unitCount = 0
    var enemyCount = 0

    unitQuery(world).forEach(id=>{
      unitCount++
      if (hasComponent(world, BattleUnit, id) && BattleUnit.team[id] == 1)
        enemyCount++
    
      if (Attackable.currentHitpoints[id] <= 0 && !hasComponent(world, Dead, id)) {
        addComponent(world, Dead, id)
        console.log("Unit died: "+id)
        EventCenter.emit("unitDied", id)
        
      }
      

      if (!hasComponent(world, Dead, id) && hasComponent(world, BattleUnit, id)) {
        alives[BattleUnit.team[id]] += 1
      }

    })
    
    if (unitCount > 0 && enemyCount>0) {
        for (let i = 0; i<2;i++) {
            if (alives[i] == 0 ) {
                
                EventCenter.emit("allUnitsDead", i)
            }
        }
    }

    
    
    
    return world
  }
}