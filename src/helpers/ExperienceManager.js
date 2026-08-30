
import * as Utils from "../helpers/Utils" 
import { EventCenter } from "../helpers/EventCenter" 

import { UnitClass } from "../components/ClassType" 


const expPerLevel = [
  0,
  10,
  20,
  30,
  40,
  50 
]

export const ExperienceManager = {
  giveExperience : (unitData) => {
    var exp = 10
    
    unitData.exp+=exp
    if (unitData.exp >= expPerLevel[unitData.level]) {
      unitData.exp -= expPerLevel[unitData.level]
      unitData.level++
      unitData.hitpoints = Math.floor(unitData.hitpoints * 1.2)
      unitData.armorClass = Math.floor(unitData.armorClass * 1.2)
      unitData.atk = Math.floor(unitData.atk * 1.2)
      unitData.damage = Math.floor(unitData.damage * 1.2)
      
      if (unitData.classType == UnitClass.WARRIOR) {
        unitData.threatMods.attack = Math.round(unitData.threatMods.attack*1.1)
      }
      
      if (unitData.healer) {
        unitData.healer.amount = Math.floor(unitData.healer.amount * 1.2)
      }
      unitData.recruitmentCost = Math.round(unitData.recruitmentCost * 1.4)
      
      return true
    }
    
    return false
  }
  
}



