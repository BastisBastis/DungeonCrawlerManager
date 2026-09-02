
import * as Utils from "../helpers/Utils" 
import { EventCenter } from "../helpers/EventCenter" 

import { UnitClass } from "../components/ClassType" 


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
        "healAmount"
      ]) {
        gainMods[key] = Math.random()*.2+.9
      }
      
      unitData.exp -= expPerLevel[unitData.level]
      unitData.level++
      unitData.hitpoints = Math.floor(unitData.hitpoints * 1.2*gainMods.hitpoints)
      result.hitpoints = 1.2*gainMods.hitpoints
      unitData.armorClass = Math.floor(unitData.armorClass * 1.2 * gainMods.armorClass)
      result.armorClass = 1.2*gainMods.armorClass
      unitData.atk = Math.floor(unitData.atk * 1.2 * gainMods.atk)
      result.atk = 1.2*gainMods.atk
      
      unitData.damage = Math.floor(unitData.damage * 1.2 * gainMods.damage)
      result.damage = 1.2*gainMods.damage
      
      if (unitData.classType == UnitClass.WARRIOR) {
        unitData.threatMods.attack = Math.round(unitData.threatMods.attack*1.1 * gainMods.threatMod)
        result.threatMod = 1.1*gainMods.threatMod
      }
      
      if (unitData.healer) {
        unitData.healer.amount = Math.floor(unitData.healer.amount * 1.2 * gainMods.healAmount)
        result.healAmount = 1.2*gainMods.healAmount
      }
      unitData.recruitmentCost = Math.round(unitData.recruitmentCost * 1.4)
      
      return result
    }
    
    return false
  }
  
}



