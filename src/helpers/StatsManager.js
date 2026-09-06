import { EventCenter } from "./EventCenter"

import { UnitIndex } from "../components/UnitIndex"
import { BattleUnit } from "../components/BattleUnit"
import { NameHelper } from "./NameHelper"
import { hasComponent } from "bitecs"

var statLogs = []
var world

export const StatsManager = {
  
    reset : () => {
        statLogs = []
    },

    setupForDungeon : (thisWorld) => {
        world = thisWorld
        statLogs.push({
            startTime: Date.now(),
            units:{},
            log: []
        })
        EventCenter.on("damageTaken", StatsManager.onDamageTaken)
        EventCenter.on("unitWasHealed", StatsManager.onHeal)
        EventCenter.on("unitDied", StatsManager.onUnitDied)
    },
    
    onUnitDied : (id) =>{
      statLogs[statLogs.length-1].log.push({
          event: "death",
          time: Date.now(),
          id
      })
    },
    
    onHeal : (data) =>{
      statLogs[statLogs.length-1].log.push({
        event: "heal",
        time: Date.now(),
        ...data
      })
    },
    

    onDamageTaken : (data) => {
        const source = data.source
        const target = data.target
        const damage = data.damage
        const damageType = data.damageType

        const dungeonLog = statLogs[statLogs.length-1]
        
        var sourceUnitIndex
        var sourceName = NameHelper.GetName(world, source)
        var targetUnitIndex
        var targetName = NameHelper.GetName(world, target)

        if (hasComponent(world, UnitIndex, source))
            sourceUnitIndex = UnitIndex.index[source]

        if (hasComponent(world, UnitIndex, target))
            targetUnitIndex = UnitIndex.index[target]

        dungeonLog.log.push({
            event: "damageTaken",
            time: Date.now(),
            source,
            target,
            sourceUnitIndex,
            targetUnitIndex,
            sourceName,
            targetName,
            damage,
            damageType
        })


    },

    getAllLogs : () => {
        return statLogs
    },
    
    getDungeonSummary : (index) =>{
      if (index === undefined) 
        index = statLogs.length-1
        
      const dungeonLog = statLogs[index]
      
      const gapThreshold = 1000
      
      const fights = []
      
      
      
    }

}