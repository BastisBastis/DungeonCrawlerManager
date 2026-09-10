import { EventCenter } from "../helpers/EventCenter"

import { UnitIndex } from "../components/UnitIndex"
import { BattleUnit } from "../components/BattleUnit"
import { NameHelper } from "../helpers/NameHelper"
import { hasComponent } from "bitecs"

var statLogs = []
var world

var mockSummary 

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
  
  /*
  if (statLogs.length === 0)
    return mockSummary
  */
  
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
      //console.log("death of " + entry.id,currentFighters)
      if (enemyCount == 0) {
        //0console.log(currentFighters)
        currentFight = []
        //currentFighters = []
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
        if (entry.target > 3)
          //console.log ("adding id: " + entry.target, entry.targetName)
        currentFighters.push({
          id:entry.target,
          unitIndex: entry.targetUnitIndex
        })
      }
      if (newSource) {
        if (entry.source > 3)
          //console.log ("adding id: " + entry.source, entry.sourceName)
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
      var startIndex = -1
      var foundStart = false
      var i = 0
      while (!foundStart && i < fight.length -1) {
        
        if (fight[i].event != "death" && fight[i].event != "heal") {
          foundStart = true
          startIndex = i
        }
        i++
      }
      if (!foundStart)
        continue
      fightSummary.duration = fight[fight.length -1].time - fight[startIndex].time
      fightSummaries.push(fightSummary)
    }
    
    
   
    
    const addUnitIfNeeded = (entry) => {

  const addHero = (index, name) => {
    if (!heroes[index]) {
      heroes[index] = {
        ...unitPattern,
        name,
        unitIndex : index
      }
    }
  }

  const addEnemy = (index, name) => {
    if (!enemies[index]) {
      enemies[index] = {
        ...unitPattern,
        name
      }
    }
  }

  // Source
  if (entry.sourceUnitIndex !== undefined) {
    addHero(entry.sourceUnitIndex, entry.sourceName)
  } else {
    addEnemy(entry.source, entry.sourceName)
  }

  // Target
  if (entry.targetUnitIndex !== undefined) {
    addHero(entry.targetUnitIndex, entry.targetName)
  } else {
    addEnemy(entry.target, entry.targetName)
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
      
     
      if (entry.event == "heal") {
        //console.log("damage taken")
        addUnitIfNeeded(entry)
        //console.log(heroes, entry)
        
        if (entry.targetUnitIndex!== undefined) 
          heroes[entry.targetUnitIndex].healReceived+= entry.amount
        else
          enemies[entry.target].healReceived+= entry.amount
        
        if (entry.sourceUnitIndex!== undefined) 
          heroes[entry.sourceUnitIndex].healDealt+= entry.amount
        else
          enemies[entry.target].healDealt+= entry.amount
      }
      
      
    }
    
  }
  
  
  summary.unitsTotal ={}
  summary.fightSummaries.forEach(fightSummary=>{
    for (const hero of Object.values(fightSummary.heroes) ) {
      if (!summary.unitsTotal[hero.unitIndex]) {
        summary.unitsTotal[hero.unitIndex] = {
          ...hero,
          duration: fightSummary.duration
        }
      }
      else {
        summary.unitsTotal[hero.unitIndex].damageDealt += hero.damageDealt
        summary.unitsTotal[hero.unitIndex].damageTaken += hero.damageTaken
        summary.unitsTotal[hero.unitIndex].healDealt += hero.healDealt
        summary.unitsTotal[hero.unitIndex].healReceived += hero.healReceived
        summary.unitsTotal[hero.unitIndex].duration += fightSummary.duration
      }
    }
  })
  
  return summary
      
      
}

export const getAllDungeonLogs = () => {
    return statLogs
}

export const resetStatSystem = ()=>{
  statLogs = []
}

export const getTotalDungeonStatSummary = () =>{
  
  //const numDungeons = getAllDungeonLogs().length
  const numDungeons = 1
  
  
  const unitData = {
    
  }
  
  const totalData = {
    
  }
  
  for (let i = 0; i < numDungeons; i++) {
    
    const dungeonSummary = getDungeonSummary(i)
    for (const fightSummary of dungeonSummary.fightSummaries) {
      
      for (const hero of Object.values(fightSummary.heroes))
      {
        if (!unitData[hero.unitIndex]) {
          unitData[hero.unitIndex] = {
            ...hero,
            duration: fightSummary.duration,
            numDungeons: 0
          }
        } else {
          unitData[hero.unitIndex].damageTaken+=hero.damageTaken
          unitData[hero.unitIndex].damageDealt += hero.damageDealt
          unitData[hero.unitIndex].healReceived += hero.healReceived
          unitData[hero.unitIndex].healDealt += hero.healDealt
          unitData[hero.unitIndex].duration += fightSummary.duration
        }
        
        
        
      }
    }
    
    for (const unit of Object.values(unitData)) {
      unit.numDungeons++
    }
  }
  
  return unitData
  
}


  mockSummary = {
  fightLogs: [
    // Fight 1
    [
      {
        event: "damageTaken",
        time: 1000,
        source: 10,
        sourceName: "Goblin",
        target: 1,
        targetName: "Thorin",
        targetUnitIndex: 0,
        damage: 18
      },
      {
        event: "damageTaken",
        time: 1500,
        source: 1,
        sourceName: "Thorin",
        sourceUnitIndex: 0,
        target: 10,
        targetName: "Goblin",
        damage: 42
      },
      {
        event: "damageTaken",
        time: 2000,
        source: 11,
        sourceName: "Goblin Archer",
        target: 2,
        targetName: "Shadow",
        targetUnitIndex: 1,
        damage: 12
      },
      {
        event: "heal",
        time: 2500,
        source: 3,
        sourceName: "Elara",
        sourceUnitIndex: 2,
        target: 1,
        targetName: "Thorin",
        targetUnitIndex: 0,
        amount: 25
      },
      {
        event: "damageTaken",
        time: 3000,
        source: 2,
        sourceName: "Shadow",
        sourceUnitIndex: 1,
        target: 11,
        targetName: "Goblin Archer",
        damage: 35
      },
      {
        event: "death",
        time: 4500,
        id: 10
      }
    ],

    // Fight 2
    [
      {
        event: "damageTaken",
        time: 8000,
        source: 20,
        sourceName: "Skeleton",
        target: 0,
        targetName: "Thorin",
        targetUnitIndex: 0,
        damage: 22
      },
      {
        event: "damageTaken",
        time: 8500,
        source: 1,
        sourceName: "Thorin",
        sourceUnitIndex: 0,
        target: 20,
        targetName: "Skeleton",
        damage: 55
      },
      {
        event: "damageTaken",
        time: 9000,
        source: 21,
        sourceName: "Skeleton",
        target: 2,
        targetName: "Shadow",
        targetUnitIndex: 1,
        damage: 17
      },
      {
        event: "damageTaken",
        time: 9500,
        source: 22,
        sourceName: "Skeleton Warrior",
        target: 3,
        targetName: "Elara",
        targetUnitIndex: 2,
        damage: 31
      },
      {
        event: "heal",
        time: 10000,
        source: 3,
        sourceName: "Elara",
        sourceUnitIndex: 2,
        target: 3,
        targetName: "Elara",
        targetUnitIndex: 2,
        amount: 40
      },
      {
        event: "damageTaken",
        time: 11000,
        source: 23,
        sourceName: "Skeleton Archer",
        target: 4,
        targetName: "Brutus",
        targetUnitIndex: 3,
        damage: 28
      },
      {
        event: "damageTaken",
        time: 11500,
        source: 4,
        sourceName: "Brutus",
        sourceUnitIndex: 3,
        target: 23,
        targetName: "Skeleton Archer",
        damage: 63
      },
      {
        event: "death",
        time: 13000,
        id: 20
      }
    ],

    // Fight 3
    [
      {
        event: "damageTaken",
        time: 16000,
        source: 30,
        sourceName: "Zombie",
        target: 4,
        targetName: "Brutus",
        targetUnitIndex: 3,
        damage: 35
      },
      {
        event: "damageTaken",
        time: 16500,
        source: 0,
        sourceName: "Thorin",
        sourceUnitIndex: 0,
        target: 30,
        targetName: "Zombie",
        damage: 70
      },
      {
        event: "heal",
        time: 17000,
        source: 3,
        sourceName: "Elara",
        sourceUnitIndex: 2,
        target: 4,
        targetName: "Brutus",
        targetUnitIndex: 3,
        amount: 30
      },
      {
        event: "damageTaken",
        time: 17500,
        source: 31,
        sourceName: "Zombie",
        target: 2,
        targetName: "Shadow",
        targetUnitIndex: 1,
        damage: 19
      },
      {
        event: "damageTaken",
        time: 18000,
        source: 2,
        sourceName: "Shadow",
        sourceUnitIndex: 1,
        target: 31,
        targetName: "Zombie",
        damage: 48
      },
      {
        event: "death",
        time: 19500,
        id: 30
      }
    ]
  ],

  fightSummaries: [
    {
      duration: 3500,

      heroes: {
        0: {
          name: "Thorin",
          damageDealt: 42,
          damageTaken: 18,
          healReceived: 25,
          healDealt: 0,
          unitIndex: 0
        },
        1: {
          name: "Shadow",
          damageDealt: 35,
          damageTaken: 12,
          healReceived: 0,
          healDealt: 0,
          unitIndex: 1
        },
        2: {
          name: "Elara",
          damageDealt: 0,
          damageTaken: 0,
          healReceived: 0,
          healDealt: 25,
          unitIndex: 2
        }
      },

      enemies: {
        10: {
          name: "Goblin",
          damageDealt: 18,
          damageTaken: 42,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        },
        11: {
          name: "Goblin Archer",
          damageDealt: 12,
          damageTaken: 35,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        }
      }
    },

    {
      duration: 5000,

      heroes: {
        0: {
          name: "Thorin",
          damageDealt: 55,
          damageTaken: 22,
          healReceived: 0,
          healDealt: 0,
          unitIndex: 0
        },
        1: {
          name: "Shadow",
          damageDealt: 0,
          damageTaken: 17,
          healReceived: 0,
          healDealt: 0,
          unitIndex: 1
        },
        2: {
          name: "Elara",
          damageDealt: 0,
          damageTaken: 31,
          healReceived: 40,
          healDealt: 40,
          unitIndex: 2
        },
        3: {
          name: "Brutus",
          damageDealt: 63,
          damageTaken: 28,
          healReceived: 0,
          healDealt: 0,
          unitIndex: 3
        }
      },

      enemies: {
        20: {
          name: "Skeleton",
          damageDealt: 22,
          damageTaken: 55,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        },
        21: {
          name: "Skeleton",
          damageDealt: 17,
          damageTaken: 0,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        },
        22: {
          name: "Skeleton Warrior",
          damageDealt: 31,
          damageTaken: 0,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        },
        23: {
          name: "Skeleton Archer",
          damageDealt: 28,
          damageTaken: 63,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        }
      }
    },

    {
      duration: 3500,

      heroes: {
        0: {
          name: "Thorin",
          damageDealt: 70,
          damageTaken: 0,
          healReceived: 0,
          healDealt: 0,
          unitIndex: 0
        },
        1: {
          name: "Shadow",
          damageDealt: 48,
          damageTaken: 19,
          healReceived: 0,
          healDealt: 0,
          unitIndex: 1
        },
        2: {
          name: "Elara",
          damageDealt: 0,
          damageTaken: 0,
          healReceived: 0,
          healDealt: 30,
          unitIndex: 2
        },
        3: {
          name: "Brutus",
          damageDealt: 0,
          damageTaken: 35,
          healReceived: 30,
          healDealt: 0,
          unitIndex: 3
        }
      },

      enemies: {
        30: {
          name: "Zombie",
          damageDealt: 35,
          damageTaken: 70,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        },
        31: {
          name: "Zombie",
          damageDealt: 19,
          damageTaken: 48,
          healReceived: 0,
          healDealt: 0,
          unitIndex: undefined
        }
      }
    }
  ]
}