import Phaser from "phaser"
import {
  addEntity,
  addComponent
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

import { BattleUnit } from "../components/BattleUnit"
import { Attackable } from "../components/Attackable"
import { MeleeAttack } from "../components/MeleeAttack"
import { Color } from "../components/Color" 
import { Position } from "../components/Position" 
import { CheckpointFollower } from "../components/CheckpointFollower" 
import { Healer } from "../components/Healer" 
import { Name } from "../components/Name" 
import { ThreatMod } from "../components/ThreatMod" 






export const UnitFactory = {
  
  getUnitEntityFromData : (world, unitData) => {
    const id = addEntity(world)
    unitData = id
    addComponent(world, Action, id)
    addComponent(world, BattleUnit, id)
    addComponent(world, Attackable, id)
    addComponent(world, MeleeAttack, id)
    addComponent(world, Position, id)
    addComponent(world, Color, id)
    
    
    
    
    

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
    
    if (unitData.nameIndex) {
      addComponent(world, Name, id)
      Name.index[id] = unitData.nameIndex
    }
    
    
    
    Position.x[id] = unitData.position.x
    Position.y[id] = unitData.position.y
    
    Color.hex[id] = unitData.color
    
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
      
    
    return id
  }

  getRandomUnitData : () => {
    

    
    const classType = [
      UnitClass.WARRIOR,
      UnitClass.CLERIC,
      UnitClass.ROGUE
    ][Utils.getRandomInt(0,3)]
    
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
        attackMin: 51.4,
        attackMax: 52.0,
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
      healAmount: 60,
      healDelay : 50,
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
    

    var hp = Utils.getRandomBellInt(classValues[classType].hpMin, classValues[classType].hpMax, 3)
    var ac = Utils.getRandomBellInt(classValues[classType].acMin,classValues[classType].acMax,3)
    var damage = Utils.getRandomBellInt(classValues[classType].dmgMin,classValues[classType].dmgMax,3)
    var delay = Utils.getRandomBellInt(classValues[classType].delayMin,classValues[classType].delayMax, 3)
    var atk = Utils.getRandomBellInt(classValues[classType].atkMin,classValues[classType].atkMax, 3)
    
    var threatMods = {
      attack: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.attackMin, classValues[classType].threatMods.attackMax)*100)/100,
      proximity: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.proximityMin, classValues[classType].threatMods.proximityMax)*100)/100,
      heal: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.healMin, classValues[classType].threatMods.healMax)*100)/100,
      other: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.otherMin, classValues[classType].threatMods.otherMax)*100)/100,
    }
    
    var nameIndex = NameHelper.getNextNameIndex()
    var name = UnitNames[nameIndex]

    let healer =false
    if (classValues[classType].healer) {
      healer = {
        amount:classValues[classType].healAmount,
        delay: classValues[classType].healDelay
      }
    }

    
    const unitData = {
      hitpoints : hp,
      armorClass : ac,
      damage,
      delay,
      atk,
      name,
      classType,
      name,
      nameIndex,
      threatMods,
      healer
    }
    
    return unitData
    

  }
  
  
  
  
  
  
}