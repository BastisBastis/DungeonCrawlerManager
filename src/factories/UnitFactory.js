import Phaser from "phaser"
import {
  addEntity,
  addComponent,
  hasComponent
} from "bitecs"

//factories

//helpers
import { NameHelper } from "../helpers/NameHelper" 
import { GlobalStuff } from "../helpers/GlobalStuff"
import { Store } from "../helpers/Store" 
import * as Utils from "../helpers/Utils"

//Data
import { UnitNames } from "../data/UnitNames" 
import Models from "../data/Models.json"

//Components

import { Action } from "../components/Action"
import { UnitIndex } from "../components/UnitIndex"
import { BattleUnit } from "../components/BattleUnit"
import { Attackable } from "../components/Attackable"
import { MeleeAttack } from "../components/MeleeAttack"
import { Color } from "../components/Color" 
import { Position } from "../components/Position" 
import { CheckpointFollower } from "../components/CheckpointFollower" 
import { Healer } from "../components/Healer" 
import { Name } from "../components/Name" 
import { ThreatMod } from "../components/ThreatMod" 
import { ClassType } from "../components/ClassType"
import { UnitClass } from "../components/ClassType"
import { Level } from "../components/Level"
import { EnemyIndex } from "../components/EnemyIndex" 
import { Rotation } from "../components/Rotation"
import { Model } from "../components/Model"
import { Mana } from "../components/Mana"
import { NameTag } from "../components/NameTag"

import { Traits } from "../components/Traits" 
import { AttackAudio } from "../components/AttackAudio" 
  import { Tactics } from "../components/Tactics" 


import { TraitList } from "../data/Traits" 


const getWeightedStatValue = (value, average, weight) => {
      if (weight >= 0) {
        return Math.pow(value / average, weight)
      }
    
      return Math.pow(average / value, -weight)
    }


export const classValues = {}
    classValues[UnitClass.WARRIOR] = {
      hpMin : 80,
      hpMax : 100,
      acMin : 12,
      acMax : 15,
      dmgMin : 10,
      dmgMax : 14,
      delayMin : 20,
      delayMax : 25,
      atkMin : 6,
      atkMax : 9,
      threatMods: {
        attackMin: 1.5,
        attackMax: 3.0,
        proximityMin: 2.1,
        proximityMax: 2.1,
        healMin: 1.0,
        healMax: 1.0,
        otherMin: 1.0,
        otherMax: 1.0
      },
      healer: false,
      modelIndex:Models.warrior,
      costWeights: {
        hp: 1,
        ac: 1,
        dmg: 1,
        delay: -1,
        atk: 1,
        threat: 1
      }
    }
  classValues[UnitClass.CLERIC] = {
      hpMin : 30,
      hpMax : 50,
      acMin : 7,
      acMax : 10,
      dmgMin : 4,
      dmgMax : 8,
      delayMin : 11,
      delayMax : 16,
      atkMin : 4,
      atkMax : 7,
      healer: true,
      healAmountMin: 20,
      healAmountMax: 30,
      healDelayMin : 60,
      healDelayMax : 80,
      manaMax : 25,
      manaMin : 15,
      threatMods: {
        attackMin: 1.0,
        attackMax: 1.0,
        proximityMin: 1.0,
        proximityMax: 1.0,
        healMin: 1.0,
        healMax: 1.0,
        otherMin: 1.0,
        otherMax: 1.0
      },
      modelIndex:Models.cleric,
      costWeights: {
        hp: 1,
        ac: 1,
        dmg: 1,
        delay: -1,
        atk: 1,
        threat: 1,
        healAmount: 1.5,
        healDelay: -2,
        mana: 2
      }
    }
    classValues[UnitClass.ROGUE] = {
      hpMin : 50,
      hpMax : 80,
      acMin : 7,
      acMax : 10,
      dmgMin : 10,
      dmgMax : 14,
      delayMin : 12,
      delayMax : 16,
      atkMin : 9,
      atkMax : 15,
      healer: false,
      threatMods: {
        attackMin: 1.0,
        attackMax: 1.0,
        proximityMin: 1.0,
        proximityMax: 1.0,
        healMin: 1.0,
        healMax: 1.0,
        otherMin: 1.0,
        otherMax: 1.0
      },
      modelIndex:Models.rogue,
      costWeights: {
        hp: 1,
        ac: 1,
        dmg: 2.2,
        delay: -2.2,
        atk: 2.2,
        threat: 1
      }
    }
    

export const getCostMod = (classType, value, valueKey) => {
  
  
  const averages = {}
  
  averages.hp = (classValues[classType].hpMin+ classValues[classType].hpMax) /2
    averages.ac = (classValues[classType].acMin+ classValues[classType].acMax) /2
    averages.dmg = (classValues[classType].dmgMin+ classValues[classType].dmgMax) /2
    averages.delay = (classValues[classType].delayMin+ classValues[classType].delayMax) /2
    averages.atk = (classValues[classType].atkMin+ classValues[classType].atkMax) /2
    averages.threat = (
      classValues[classType].threatMods.attackMin + classValues[classType].threatMods.attackMax) / 2
      
  
  if (classValues[classType].healer) {
    averages.mana = (classValues[classType].manaMin + classValues[classType].manaMax) /2
    averages.healAmount = (classValues[classType].healAmountMin+ classValues[classType].healAmountMax) /2
      averages.healDelay = (classValues[classType].healDelayMin+ classValues[classType].healDelayMax) /2
  }
  //console.log(classType, averages)
  
  //console.log(classType, classValues)
  
  return Math.pow(getWeightedStatValue(value, averages[valueKey], classValues[classType].costWeights[valueKey]),.5)
  
}

export const UnitFactory = {
  
  getUnitEntityFromData : (world, unitData) => {
    const id = addEntity(world)
    unitData.id = id
    addComponent(world, Action, id)
    addComponent(world, BattleUnit, id)
    addComponent(world, Attackable, id)
    addComponent(world, MeleeAttack, id)
    addComponent(world, Position, id)
    addComponent(world, Color, id)
    addComponent(world, Level, id)
    addComponent(world, Rotation, id)
    addComponent(world, ClassType, id)
    addComponent(world, Model, id)
    addComponent(world, Traits, id)
    addComponent(world, AttackAudio, id)
   
    
    

    if (unitData.healer) {
      
      addComponent(world, Healer, id)
      Healer.amount[id] = unitData.healer.amount
      Healer.delay[id] = unitData.healer.delay
      Healer.coolDown[id] = 0
    }
    
     if (unitData.mana) {
      //console.log(unitData.mana)
      addComponent(world, Mana, id),
      Mana.maxMana[id] = unitData.mana
      Mana.currentMana[id] = unitData.mana
     }
    
    
    Action.target[id] = 0
    BattleUnit.team[id] = unitData.team
    
    
    
    Attackable.maxHitpoints[id] = unitData.hitpoints
    Attackable.currentHitpoints[id] = Attackable.maxHitpoints[id]
    Attackable.armorClass[id] = unitData.armorClass
    
    MeleeAttack.damage[id] = unitData.damage
    MeleeAttack.delay[id] = unitData.delay
    MeleeAttack.coolDown[id] = 0
    MeleeAttack.atk[id] = unitData.atk
    MeleeAttack.buildUpTime[id] = unitData.attackBuildUp
    
    AttackAudio.soundDelay[id] = unitData.soundDelay ? unitData.soundDelay : 1
    AttackAudio.audioKey[id] = unitData.audioKey !==undefined ? unitData.audioKey : 1
    
    if (unitData.nameIndex !== undefined) {
      addComponent(world, Name, id)
      Name.index[id] = unitData.nameIndex
    }
    
    
    
    Position.x[id] = unitData.position.x
    Position.y[id] = unitData.position.y
    
    Color.hex[id] = unitData.color

    Level.value[id] = unitData.level

    ClassType.type[id] = unitData.classIndex

    Model.index[id] = unitData.modelIndex
    
    if (unitData.checkpointFollower) {
      addComponent(world, CheckpointFollower, id)
      CheckpointFollower.index[id] = 0
    }
    
    if (unitData.threatMods) {
      addComponent(world, ThreatMod, id)
      ThreatMod.attack[id] = unitData.threatMods.attack
      ThreatMod.proximity[id] = unitData.threatMods.proximity
      ThreatMod.heal[id] = unitData.threatMods.heal
      ThreatMod.other[id] = unitData.threatMods.other
    }

    if (unitData.unitIndex !== undefined) {
      addComponent(world, UnitIndex, id)
      UnitIndex.index[id] = unitData.unitIndex
      addComponent(world, NameTag, id)
    }

    if (unitData.enemyIndex !== undefined) {
      addComponent(world, EnemyIndex, id)
      EnemyIndex.index[id] = unitData.enemyIndex
    }
    
    Traits.count[id] = 0
    
    if (unitData.traits) {
      Traits.count[id] = unitData.traits.length
      for (let i in unitData.traits) {
        Traits.traits[id][i] = unitData.traits[i]
      }
      
      for (const traitIndex of unitData.traits) {
        for (const effect of TraitList[traitIndex].effects) {
          if (effect.type =="attackStatMod") {
            
            MeleeAttack.damage[id] *= effect.damageMod
            MeleeAttack.delay[id] *= effect.delayMod
            MeleeAttack.atk[id] += effect.atkMod
          }
          if (effect.type =="defenseStatMod") {
            
            Attackable.maxHitpoints[id] *= effect.hpMod
            Attackable.currentHitpoints[id] = Attackable.maxHitpoints[id]
            Attackable.armorClass[id] *= effect.acMod
            
            
          }
        }
        
      }
      
      
    }
    
    if (unitData.unitIndex !== undefined && Store.run.tactics[unitData.unitIndex] !== undefined) {
      addComponent(world, Tactics, id)
      Tactics.index[id] = Store.run.tactics[unitData.unitIndex]
    }
    
    
    return id
  },

  getRandomUnitData : (level = 1, classIndex = -1) => {
    

    if (classIndex == -1)
      classIndex = Utils.getRandomInt(0,3)
    
    const classType = [
      UnitClass.WARRIOR,
      UnitClass.CLERIC,
      UnitClass.ROGUE
    ][classIndex]
    
    
    

    var hp = Utils.getRandomBellInt(classValues[classType].hpMin, classValues[classType].hpMax, 1)
    var ac = Utils.getRandomBellInt(classValues[classType].acMin,classValues[classType].acMax,1)
    var damage = Utils.getRandomBellInt(classValues[classType].dmgMin,classValues[classType].dmgMax,1)
    var delay = Utils.getRandomBellInt(classValues[classType].delayMin,classValues[classType].delayMax, 1)
    var atk = Utils.getRandomBellInt(classValues[classType].atkMin,classValues[classType].atkMax, 1)
    
    var threatMods = {
      attack: Phaser.Math.FloatBetween(classValues[classType].threatMods.attackMin, classValues[classType].threatMods.attackMax),
      proximity: Phaser.Math.FloatBetween(classValues[classType].threatMods.proximityMin, classValues[classType].threatMods.proximityMax),
      heal: Phaser.Math.FloatBetween(classValues[classType].threatMods.healMin, classValues[classType].threatMods.healMax),
      other: Phaser.Math.FloatBetween(classValues[classType].threatMods.otherMin, classValues[classType].threatMods.otherMax),
    }
    
    var nameIndex = NameHelper.getNextNameIndex()
    var name = UnitNames[nameIndex]

    let healer =false
    if (classValues[classType].healer) {
      healer = {
        amount:Utils.getRandomBellInt(classValues[classType].healAmountMin,classValues[classType].healAmountMax, 1),
        delay: Utils.getRandomInt(classValues[classType].healDelayMin,classValues[classType].healDelayMax)
      }
    }

    let mana
    if (classValues[classType].manaMax) {
      mana = Utils.getRandomBellInt(classValues[classType].manaMin,classValues[classType].manaMax, 1)
    }

    var recruitmentCost = 10
    
    var costMod = getCostMod(classType, hp, "hp")
    costMod *= getCostMod(classType, ac, "ac")
    costMod *= getCostMod(classType, damage, "dmg")
    costMod *= getCostMod(classType, delay, "delay")
    costMod *= getCostMod(classType, atk, "atk")
    costMod *= getCostMod(classType, threatMods.attack, "threat")
    
    
    
     
    if (mana) {
      costMod *= getCostMod(classType, mana, "mana")
    }
      
    if ( healer ) {
      costMod *= getCostMod(classType, healer.amount, "healAmount")
      costMod *= getCostMod(classType, healer.delay, "healDelay")
      
      
    }
    
    const attackBuildUp = 600
    const soundDelay = 200
    const audioKey = 0
    
    recruitmentCost = Math.round(recruitmentCost *costMod)
    
    const traits = [
      
    ]
    if (classType == "Cleric")
      traits.push(18)

    //hp = 900
    //damage = 150
    
    
    const unitData = {
      hitpoints : hp,
      armorClass : ac,
      damage,
      delay,
      atk,
      name,
      classType,
      classIndex,
      name,
      nameIndex,
      threatMods,
      healer,
      mana,
      level,
      recruitmentCost,
      exp : 0,
      traits,
      attackBuildUp,
      soundDelay,
      audioKey,
      modelIndex:classValues[classType].modelIndex
    }
    
    return unitData
    

  }
  
  
  
  
  
  
}