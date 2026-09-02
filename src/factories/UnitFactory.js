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
import * as Utils from "../helpers/Utils"

//Data
import { UnitNames } from "../data/UnitNames" 

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
    

    if (unitData.healer) {
      
      addComponent(world, Healer, id)
      Healer.amount[id] = unitData.healer.amount
      Healer.delay[id] = unitData.healer.delay
      Healer.coolDown[id] = 0
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
    
    if (unitData.nameIndex !== undefined) {
      addComponent(world, Name, id)
      Name.index[id] = unitData.nameIndex
    }
    
    
    
    Position.x[id] = unitData.position.x
    Position.y[id] = unitData.position.y
    
    Color.hex[id] = unitData.color

    Level.value[id] = unitData.level

    ClassType.type[id] = unitData.classIndex
    
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
      hpMin : 100,
      hpMax : 150,
      acMin : 12,
      acMax : 20,
      dmgMin : 6,
      dmgMax : 10,
      delayMin : 15,
      delayMax : 20,
      atkMin : 6,
      atkMax : 10,
      threatMods: {
        attackMin: 35,
        attackMax: 45.0,
        proximityMin: 1.0,
        proximityMax: 1.0,
        healMin: 1.0,
        healMax: 1.0,
        otherMin: 1.0,
        otherMax: 1.0
      },
      healer: false
    }
  classValues[UnitClass.CLERIC] = {
      hpMin : 40,
      hpMax : 70,
      acMin : 7,
      acMax : 10,
      dmgMin : 4,
      dmgMax : 8,
      delayMin : 11,
      delayMax : 16,
      atkMin : 5,
      atkMax : 9,
      healer: true,
      healAmountMin: 30,
      healAmounttMax: 50,
      healDelayMin : 60,
      healDelayMax : 80,
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
    }
    classValues[UnitClass.ROGUE] = {
      hpMin : 70,
      hpMax : 110,
      acMin : 7,
      acMax : 10,
      dmgMin : 10,
      dmgMax : 14,
      delayMin : 12,
      delayMax : 16,
      atkMin : 10,
      atkMax : 16,
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
    }
    

    var hp = Utils.getRandomBellInt(classValues[classType].hpMin, classValues[classType].hpMax, 1)
    var ac = Utils.getRandomBellInt(classValues[classType].acMin,classValues[classType].acMax,1)
    var damage = Utils.getRandomBellInt(classValues[classType].dmgMin,classValues[classType].dmgMax,1)
    var delay = Utils.getRandomBellInt(classValues[classType].delayMin,classValues[classType].delayMax, 1)
    var atk = Utils.getRandomBellInt(classValues[classType].atkMin,classValues[classType].atkMax, 1)
    
    var threatMods = {
      attack: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.attackMin, classValues[classType].threatMods.attackMax)),
      proximity: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.proximityMin, classValues[classType].threatMods.proximityMax)),
      heal: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.healMin, classValues[classType].threatMods.healMax)),
      other: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.otherMin, classValues[classType].threatMods.otherMax)),
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
     
    
      
    if ( healer ) {
      const avgHealAmount = (classValues[classType].healAmountMin+ classValues[classType].healAmounttMax) /2
      const avgHealDelay = (classValues[classType].healDelayMin+ classValues[classType].healAmounttMax) /2
      
      costMod *= 
        ( healer.amount / avgHealAmount ) * 
        ( avgHealDelay / healer.delay )
    }
    
    recruitmentCost = Math.floor(recruitmentCost *costMod)
    
    
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
      level,
      recruitmentCost,
      exp : 0
    }
    
    return unitData
    

  }
  
  
  
  
  
  
}