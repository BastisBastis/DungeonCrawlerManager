import { hasComponent } from "bitecs"

//components
import { Attackable } from "../components/Attackable" 

export const TRAIT = {
  NEVER_GONNA_GIVE_YOU_UP : 0
}




export const TraitList = {}
TraitList[TRAIT.NEVER_GONNA_GIVE_YOU_UP] = {
  id: TRAIT.NEVER_GONNA_GIVE_YOU_UP,
  name: "Never Gonna Give You Up",
  description: "Increases the healing amount by 50% if the heal target is below 20% hitpoints.",
  effect: {
    type: "healModifier",
    mod: 1.5,
    condition: {
      type: "healthBelowPercent",
      value: .2
    }
  }
}

const conditionChecks = {
  healthBelowPercent : ({world, target, condition}) =>{
    if (!hasComponent(world, Attackable, target)) 
      return false
    
    const currentHps = Attackable.currentHitpoints[target]
    const maxHps = Attackable.maxHitpoints[target]
    
    return (currentHps/maxHps) <= condition.value
  }
}



export const CheckTraitCondition = (data) => {
  const trait = TraitList[data.traitIndex]
  
  if (!trait || !trait.effect || trait.effect.condition)
    return true
  
  const condition = trait.effect.condition
  
  return conditionChecks[condition.type]({...data, condition})
}
  
  
  