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

import { Traits } from "../components/Traits" 
import { AttackAudio } from "../components/AttackAudio" 
  import { Tactics } from "../components/Tactics" 


import { TraitList } from "../data/Traits" 


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
    
    const classValues = {}
    classValues[UnitClass.WARRIOR] = {
      hpMin : 80,
      hpMax : 100,
      acMin : 12,
      acMax : 15,
      dmgMin : 6,
      dmgMax : 10,
      delayMin : 20,
      delayMax : 25,
      atkMin : 6,
      atkMax : 9,
      threatMods: {
        attackMin: 2,
        attackMax: 4,
        proximityMin: 2.1,
        proximityMax: 2.1,
        healMin: 1.0,
        healMax: 1.0,
        otherMin: 1.0,
        otherMax: 1.0
      },
      healer: false,
      modelIndex:Models.warrior
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
      healAmounttMax: 30,
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
      modelIndex:Models.cleric
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
      modelIndex:Models.rogue
    }
    

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
        amount:Utils.getRandomBellInt(classValues[classType].healAmountMin,classValues[classType].healAmounttMax, 1),
        delay: Utils.getRandomInt(classValues[classType].healDelayMin,classValues[classType].healDelayMax)
      }
    }

    let mana
    if (classValues[classType].manaMax) {
      mana = Utils.getRandomBellInt(classValues[classType].manaMin,classValues[classType].manaMax, 1)
    }

    var recruitmentCost = 10
    const avgHp = (classValues[classType].hpMin+ classValues[classType].hpMax) /2
    const avgAc = (classValues[classType].acMin+ classValues[classType].acMax) /2
    const avgDmg = (classValues[classType].dmgMin+ classValues[classType].dmgMax) /2
    const avgDelay = (classValues[classType].delayMin+ classValues[classType].delayMax) /2
    const avgAtk = (classValues[classType].atkMin+ classValues[classType].atkMax) /2
    
    
    
    
    
    var costMod = 1 *
      ( hp / avgHp ) *
      ( ac / avgAc ) *
      ( damage / avgDmg ) *
      ( avgDelay / delay ) *
      ( atk / avgAtk )
     
    if (mana) {
      const avgMana = (classValues[classType].manaMin + classValues[classType].manaMax) /2
      costMod *= (mana / avgMana)
    }
      
    if ( healer ) {
      const avgHealAmount = (classValues[classType].healAmountMin+ classValues[classType].healAmounttMax) /2
      const avgHealDelay = (classValues[classType].healDelayMin+ classValues[classType].healAmounttMax) /2
      
      costMod *= 
        ( healer.amount / avgHealAmount ) * 
        ( avgHealDelay / healer.delay )
    }
    
    const attackBuildUp = 600
    const soundDelay = 200
    const audioKey = 0
    
    recruitmentCost = Math.floor(recruitmentCost *costMod)
    
    const traits = [
      
    ]
    if (classType == "Cleric")
      traits.push()

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