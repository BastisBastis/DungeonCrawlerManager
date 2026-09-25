
import * as Utils from "../helpers/Utils" 
import { EventCenter } from "../helpers/EventCenter" 

import { UnitClass } from "../components/ClassType" 
import { getCostMod } from "../factories/UnitFactory" 
import { Store } from "../helpers/Store" 

const expPerLevel = [
  0,
  10,
  20,
  20,
  20,
  20 
]

export const ExperienceManager = {
  giveExperience : (unitData) => {
    var exp = 10
    
    const metaMod = [1,1.1,1.2,1.4][Store.meta.progression.training]
    
    unitData.exp+=exp
    if (unitData.exp >= expPerLevel[unitData.level]) {
      
      const gainMods = {}
      const result = {}
      for (const key of [
        "hitpoints",
        "armorClass",
        "atk",
        "damage",
        "threatMod",
        "healAmount",
        "mana"
      ]) {
        gainMods[key] = Math.random()*.16+.92 * metaMod
      }

      gainMods.healCooldown = Math.random() * .1 + .88 * (2-metaMod)
      
      unitData.exp -= expPerLevel[unitData.level]
      unitData.level++
      unitData.hitpoints = unitData.hitpoints * 1.2*gainMods.hitpoints
      result.hitpoints = 1.2*gainMods.hitpoints
      unitData.armorClass = unitData.armorClass * 1.2 * gainMods.armorClass
      result.armorClass = 1.2*gainMods.armorClass
      unitData.atk = unitData.atk * 1.2 * gainMods.atk
      result.atk = 1.2*gainMods.atk
      
      unitData.damage = unitData.damage * 1.2 * gainMods.damage
      result.damage = 1.2*gainMods.damage
      
      if (unitData.classType == UnitClass.WARRIOR) {
        unitData.threatMods.attack = unitData.threatMods.attack*1.15 * gainMods.threatMod
        result.threatMod = 1.1*gainMods.threatMod
      }
      
      if (unitData.healer) {
        unitData.healer.amount = unitData.healer.amount * 1.1 * gainMods.healAmount
        result.healAmount = 1.1*gainMods.healAmount
        
        unitData.healer.delay = unitData.healer.delay * gainMods.healCooldown *.95
        result.healDelay = unitData.healer.delay * gainMods.healCooldown *.95
      }

      if (unitData.mana) {
        unitData.mana = unitData.mana * 1.2 * gainMods.mana
      }

      unitData.recruitmentCost = 10
      var costMod = getCostMod(unitData.classType, unitData.hitpoints, "hp")
      costMod *= getCostMod(unitData.classType, unitData.armorClass, "ac")
      costMod *= getCostMod(unitData.classType, unitData.damage, "dmg")
      costMod *= getCostMod(unitData.classType, unitData.delay, "delay")
      costMod *= getCostMod(unitData.classType, unitData.atk, "atk")
      costMod *= getCostMod(unitData.classType, unitData.threatMods.attack, "threat")
      
      if (unitData.mana) {
        costMod *= getCostMod(unitData.classType, unitData.mana, "mana")
      }
        
      if ( unitData.healer ) {
        costMod *= getCostMod(unitData.classType, unitData.healer.amount, "healAmount")
        costMod *= getCostMod(unitData.classType, unitData.healer.delay, "healDelay")
        
        
      }
      
      unitData.recruitmentCost = Math.round(unitData.recruitmentCost * costMod)
      
      return result
    }
    
    return false
  }
  
}



