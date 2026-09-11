import { hasComponent } from "bitecs"

//components
import { Attackable } from "../components/Attackable" 

export const TRAIT = {
  NEVER_GONNA_GIVE_YOU_UP : 0,
  OH_NO_YOU_WONT : 1,
  SADIST : 2
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
      type: "targetHealthBelowPercent",
      value: .2
    }
  }
}
TraitList[TRAIT.OH_NO_YOU_WONT] = {
  id: TRAIT.OH_NO_YOU_WONT,
  name: "Oh No, You Won't",
  description: "Reduces incoming damage with 40% when you are below 30% hitpoints.",
  effect: {
    type: "damageMitigation",
    mod: 0.7,
    condition: {
      type: "selfHealthBelowPercent",
      value: .3
    }
  }
}
TraitList[TRAIT.SADIST] = {
  id: TRAIT.SADIST,
  name: "Sadist",
  description: "Increases your damage by 30% if the target's health is below 25%.",
  effect: {
    type: "damageModifier",
    mod: 1.3,
    condition: {
      type: "targetHealthBelowPercent",
      value: .3
    }
  }
}

const conditionChecks = {
  targetHealthBelowPercent : ({world, target, condition}) =>{
    if (!hasComponent(world, Attackable, target)) 
      return false
    
    const currentHps = Attackable.currentHitpoints[target]
    const maxHps = Attackable.maxHitpoints[target]
    
    return (currentHps/maxHps) <= condition.value
  },

  selfHealthBelowPercent : ({world, id, condition}) =>{
    return conditionChecks.targetHealthBelowPercent({world, target: id, condition})
  }

}





export const CheckTraitCondition = (data) => {
  const trait = data.trait//TraitList[data.traitIndex]
  
  if (!trait || !trait.effect || !trait.effect.condition) {
    return true
  }
    
  
  const condition = trait.effect.condition
  
  return conditionChecks[condition.type]({...data, condition})
}
  
  
  