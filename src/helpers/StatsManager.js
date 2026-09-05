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
    }

}