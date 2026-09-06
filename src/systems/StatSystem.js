import { EventCenter } from "../helpers/EventCenter"

import { UnitIndex } from "../components/UnitIndex"
import { BattleUnit } from "../components/BattleUnit"
import { NameHelper } from "../helpers/NameHelper"
import { hasComponent } from "bitecs"

var statLogs = []
var world

export const createStatSystem = world =>{
  
  var timer = 0
    
  statLogs.push({
      startTime: timer,
      units:{},
      log: []
  })
  
  
  
  
  const onUnitDied = (id) =>{
    statLogs[statLogs.length-1].log.push({
        event: "death",
        time: timer,
        id
    })
  }
  
  const onHeal = (data) =>{
    statLogs[statLogs.length-1].log.push({
      event: "heal",
      time: timer,
      ...data
    })
  }
  

  const onDamageTaken = (data) => {
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
        time: timer,
        source,
        target,
        sourceUnitIndex,
        targetUnitIndex,
        sourceName,
        targetName,
        damage,
        damageType
    })


  }
    
  EventCenter.on("damageTaken", onDamageTaken)
  EventCenter.on("unitWasHealed", onHeal)
  EventCenter.on("unitDied", onUnitDied)


    
  return (world, dt)=>{
    
    timer += dt
    
    return world
  }
}

export const getDungeonSummary = (index) =>{
  const summary = {}
  if (index === undefined) 
    index = statLogs.length-1
    
  const dungeonLog = statLogs[index]
  
  const gapThreshold = 1000
  
  
  
  
  var currentFighters = []
  var currentFight = []
  const fights = [currentFight]
  
  for (const entry of dungeonLog.log) {
    if (entry.event == "death") {
      
      currentFighters = currentFighters.filter(fighter=>{
        return entry.id != fighter.id
      })
      currentFight.push(entry)
      var enemyCount = 0
      currentFighters.forEach(fighter=>{
        if (fighter.unitIndex === undefined)
          enemyCount++
      })
      //console.log("1",currentFighters)
      if (enemyCount == 0) {
        //0console.log(currentFighters)
        currentFight = []
        currentFighters = []
        fights.push(currentFight)
      }
    } else {
      currentFight.push(entry)
      var newTarget = true
      var newSource = true
      currentFighters.forEach(fighter=>{
        if (fighter.id == entry.target) {
          newTarget = false
        }
        if (fighter.id == entry.source) {
          newSource = false
        }
      })
      
      if (newTarget) {
        currentFighters.push({
          id:entry.target,
          unitIndex: entry.targetUnitIndex
        })
      }
      if (newSource) {
        currentFighters.push({
          id: entry.source,
          unitIndex: entry.sourceUnitIndex
        })
      }
      //console.log(newTarget, newSource, currentFighters)
    }
    
  }
  
  summary.fightLogs = fights
  
  const fightSummaries= []
  summary.fightSummaries = fightSummaries
  
  for (const fight of fights) {
    
    const fightSummary = {}
    const heroes = {}
    const enemies = {}
    fightSummary.heroes = heroes
    fightSummary.enemies = enemies
    
    
    
    const unitPattern = {
      name: "",
      damageDealt: 0,
      damageTaken: 0,
      healReceived: 0,
      healDealt: 0,
      unitIndex: undefined
    }
    //console.log(fights)
    if (fight.length > 0) {
      
      fightSummary.duration = fight[fight.length -1].time - fight[0].time
      fightSummaries.push(fightSummary)
    }
    
    const addUnitIfNeeded = (entry) => {
      if (entry.sourceUnitIndex !== undefined) {
        if (!heroes[entry.sourceUnitIndex]) {
          //console.log("addig hero source", entry)
          heroes[entry.sourceUnitIndex] = {
            ...unitPattern,
            name: entry.sourceName
          }
          //.log(heroes)
        }
      } else {
        if (!enemies[entry.source]) {
          enemies[entry.source] = {
            ...unitPattern,
            name: entry.sourceName
          }
        }
      }
    
      if (entry.targetUnitIndex !== undefined) {
        if (!heroes[entry.targetUnitIndex]) {
          heroes[entry.targetUnitIndex] = {
            ...unitPattern,
            name: entry.targetName
          }
        }
      } else {
        if (!enemies[entry.target]) {
          enemies[entry.target] = {
            ...unitPattern,
            name: entry.targetName
          }
        }
      }
    }
    
    for (const entry of fight) {
      //console.log(entry)
      if (entry.event == "damageTaken") {
        //console.log("damage taken")
        addUnitIfNeeded(entry)
        //console.log(heroes, entry)
        
        if (entry.targetUnitIndex!== undefined) {
          heroes[entry.targetUnitIndex].damageTaken += entry.damage
          enemies[entry.source].damageDealt += entry.damage
        } else {
          enemies[entry.target].damageTaken += entry.damage
          heroes[entry.sourceUnitIndex].damageDealt += entry.damage
        }
        
        
        
      }
      
      
    }
    
  }
  
  
  return summary
      
      
}

export const getAllDungeonLogs = () => {
    return statLogs
}

export const resetStatSystem = ()=>{
  statLogs = []
}