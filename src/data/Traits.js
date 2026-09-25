import { hasComponent, defineQuery} from "bitecs"

//components
import { Attackable } from "../components/Attackable" 
import { Mana } from "../components/Mana" 
import { BodyType } from "../components/BodyType" 
import { UnitIndex } from "../components/UnitIndex" 
import { Dead } from "../components/Dead" 


//data
import { EnemyType } from "../data/Enemies" 

export const TRAIT = {
  NEVER_GONNA_GIVE_YOU_UP : 0,
  OH_NO_YOU_WONT : 1,
  SADIST : 2,
  PROUD : 3,
  BLOODTHIRSTY : 4,
  POSSESSIVE : 5,
  SPIKED_SKIN : 6,
  RECKLESS : 7,
  LEADER : 8,
  SPRAINED_ANKLE : 9,
  PROTECTIVE : 10,
  HARD_HITTER : 11,
  QUICK_HANDS : 12,
  GREEDY : 13,
  GOLD_DIGGER : 14,
  BULKY : 15,
  NERVOUS : 16,
  LEROY_JENKINS: 17,
  CHEAPSKATE: 18,
  DESPERATE: 19,
  RIGHT_BACK_AT_YA: 20,
  CRIT_HIT: 21,
  CRIT_HEAL: 22,
  PEOPLE_PERSON: 23,
  MORBID: 24,
  INTROVERT: 25,
  BIG_TACTICS: 26,
  AOE: 27
}




export const TraitList = {}
TraitList[TRAIT.NEVER_GONNA_GIVE_YOU_UP] = {
  id: TRAIT.NEVER_GONNA_GIVE_YOU_UP,
  name: "Never Gonna Give You Up",
  description: "Increases the healing amount by 50% if the heal target is below 20% hitpoints.",
  effects: [
    {
      type: "healModifier",
      mod: 1.5,
      condition: {
        type: "targetHealthBelowPercent",
        value: .2
      }
    }
  ]
  
}
TraitList[TRAIT.OH_NO_YOU_WONT] = {
  id: TRAIT.OH_NO_YOU_WONT,
  name: "Oh No, You Won't",
  description: "Reduces incoming damage with 40% when you are below 30% hitpoints.",
  effects: [
    {
      type: "damageMitigation",
      mod: 0.7,
      condition: {
        type: "selfHealthBelowPercent",
        value: .3
      }
    }
  ]
}
TraitList[TRAIT.SADIST] = {
  id: TRAIT.SADIST,
  name: "Sadist",
  description: "Increases your damage by 30% if the target's health is below 25%.",
  effects: [
    {
      type: "damageModifier",
      mod: 1.3,
      condition: {
        type: "targetHealthBelowPercent",
        value: .3
      }
    }
  ] 
}

TraitList[TRAIT.PROUD] = {
  id: TRAIT.PROUD,
  name: "Proud",
  description: "Increases damage by 10% when at full health.",
  effects: [
    {
      type: "damageModifier",
      mod: 1.1,
      condition: {
        type: "selfHealthOverPercent",
        value: .9999
      }
    }
  ]
}

TraitList[TRAIT.BLOODTHIRSTY] = {
  id: TRAIT.BLOODTHIRSTY,
  name: "Bloodthirsty",
  description: "Gains a small amount of health for every successful attack.",
  effects: [
    {
      type: "lifeSteal",
      amount: 2
    }
  ]
}

TraitList[TRAIT.POSSESSIVE] = {
  id: TRAIT.POSSESSIVE,
  name: "Possessive",
  description: "Gains a small amount of mana for every successful attack.",
  effects: [
    {
      type: "manaSteal",
      amount: .07
    }
  ]
}

TraitList[TRAIT.SPIKED_SKIN] = {
  id: TRAIT.SPIKED_SKIN,
  name: "Spiked Skin",
  description: "Attacker takes a small amount of damage every time they hit the hero.",
  effects: [
    {
      type: "damageShield",
      amount: 2,
      
    }
  ]
}

TraitList[TRAIT.RECKLESS] = {
  id: TRAIT.RECKLESS,
  name: "Reckless",
  description: "The hero takes a small amount of damage every time the hit an enemy.",
  effects: [
    {
      type: "selfAttackDamage",
      amount: 1,
      
    }
  ]
}

TraitList[TRAIT.LEADER] = {
  id: TRAIT.LEADER,
  name: "Leader",
  description: "The hero will try to convince their party members to attack the same target as them.",
  effects: [
    {
      type: "setTeamTarget",
      mod: 10000000,
      
    }
  ]
}

TraitList[TRAIT.SPRAINED_ANKLE] = {
  id: TRAIT.SPRAINED_ANKLE,
  name: "Sprained Ankle",
  description: "Runs slightly slower due to a sprained ankle.",
  effects: [
    {
      type: "runSpeedMod",
      mod: .9,
      
    }
  ]
}

TraitList[TRAIT.PROTECTIVE] = {
  id: TRAIT.PROTECTIVE,
  name: "Protective",
  description: "Protects nearby allies by taking a portion of the damage they receive.",
  effects: [
    {
      type: "protect",
      mod: .2,
      
    }
  ]
}

TraitList[TRAIT.HARD_HITTER] = {
  id: TRAIT.HARD_HITTER,
  name: "Hard Hitter",
  description: "Attacks slower but with higher damage.",
  effects: [
    {
      type: "attackStatMod",
      delayMod: 1.25,
      damageMod: 1.25,
      atkMod: 1
      
    }
  ]
}

TraitList[TRAIT.QUICK_HANDS] = {
  id: TRAIT.QUICK_HANDS,
  name: "Quick Hands",
  description: "Attacks faster but with lower damage.",
  effects: [
    {
      type: "attackStatMod",
      delayMod: .8,
      damageMod: .8,
      atkMod: 1
      
    }
  ]
}

TraitList[TRAIT.GREEDY] = {
  id: TRAIT.GREEDY,
  name: "Greedy",
  description: "Hero takes 20% of the earned gold after each dungeon.",
  effects: [
    {
      type: "goldMod",
      mod: .8
      
    }
  ]
}

TraitList[TRAIT.GOLD_DIGGER] = {
  id: TRAIT.GOLD_DIGGER,
  name: "Gold Digger",
  description: "Hero finds 20% additional gold in every dungeon.",
  effects: [
    {
      type: "goldMod",
      mod: 1.2
    }
  ]
}

TraitList[TRAIT.BULKY] = {
  id: TRAIT.BULKY,
  name: "Bulky",
  description: "Moves slower but has increased armor class.",
  effects: [
    {
      type: "defenseStatMod",
      hpMod: 1,
      acMod: 1.15
    },
    {
      type: "runSpeedMod",
      mod: 0.8
    }
  ]
}


TraitList[TRAIT.NERVOUS] = {
  id: TRAIT.NERVOUS,
  name: "Nervous",
  description: "Takes less damage when healthy, but deals less damage when injured.",
  effects: [
    {
      type: "damageMitigation",
      mod: .85,
      condition: {
        type: "selfHealthOverPercent",
        value: .7
      }
    },
    {
      type: "damageModifier",
      mod: .8,
      condition: {
        type: "selfHealthBelowPercent",
        value: .7
      }
    }
  ]
}

TraitList[TRAIT.LEROY_JENKINS] = {
  id: TRAIT.LEROY_JENKINS,
  name: "Leroy Jenkins",
  description: "Charges into dangerous situations, prioritizing damage over defense.",
  effects: [
    {
      type: "damageMitigation",
      mod: 1.2,
      
    },
    {
      type: "damageModifier",
      mod: 1.1,
      
    }
  ]
}

TraitList[TRAIT.CHEAPSKATE] = {
  id: TRAIT.CHEAPSKATE,
  name: "Cheapskate",
  description: "Lets the hero cast spells at a lower mana cost.",
  effects: [
    {
      type: "manaCostMod",
      mod: .8
    }
  ]
}

TraitList[TRAIT.DESPERATE] = {
  id: TRAIT.DESPERATE,
  name: "Desperate",
  description: "Heals cost less mana when the hero is low on mana.",
  effects: [
    {
      type: "manaCostMod",
      mod: .5,
      condition: {
        type: "selfManaBelowPercent",
        value: .25
      }
    }
  ]
}



TraitList[TRAIT.RIGHT_BACK_AT_YA] = {
  id: TRAIT.RIGHT_BACK_AT_YA,
  name: "Right Back at Ya",
  description: "Has a chance to strike back when attacked.",
  effects: [
    {
      type: "riposte",
      chance: .5
    }
  ]
}

TraitList[TRAIT.CRIT_HIT] = {
  id: TRAIT.CRIT_HIT,
  name: "Accurate",
  description: "Has a chance to perform a critical hit doing double damage.",
  effects: [
    {
      type: "critHit",
      chance: .2,
      mod: 2
    }
  ]
}

TraitList[TRAIT.CRIT_HEAL] = {
  id: TRAIT.CRIT_HEAL,
  name: "Devout",
  description: "Has a chance to perform a critical heal, healing twice the amount.",
  effects: [
    {
      type: "healModifier",
      mod: 2,
      condition: {
        type: "random",
        chance: .5
      }
    }
  ]
}

TraitList[TRAIT.PEOPLE_PERSON] = {
  id: TRAIT.PEOPLE_PERSON,
  name: "People Person",
  description: "Does increased damage to humanoid enemies.",
  effects: [
    {
      type: "damageModifier",
      mod: 1.25,
      condition: {
        type: "targetType",
        value: EnemyType.HUMANOID
      }
    }
  ]
}

TraitList[TRAIT.MORBID] = {
  id: TRAIT.MORBID,
  name: "Morbid",
  description: "Does increased damage to undead enemies.",
  effects: [
    {
      type: "damageModifier",
      mod: 1.25,
      condition: {
        type: "targetType",
        value: EnemyType.UNDEAD
      }
    }
  ]
}

TraitList[TRAIT.INTROVERT] = {
  id: TRAIT.INTROVERT,
  name: "Introvert",
  description: "Damage increases with each lost party member.",
  effects: [
    {
      type: "damageModifier",
      mod: 1.1,
      condition: {
        type: "maxPartyMembers",
        value: 3
      }
    },
    {
      type: "damageModifier",
      mod: 1.3,
      condition: {
        type: "maxPartyMembers",
        value: 2
      }
    },
    {
      type: "damageModifier",
      mod: 1.6,
      condition: {
        type: "maxPartyMembers",
        value: 1
      }
    }
  ]
}

TraitList[TRAIT.BIG_TACTICS] = {
  id: TRAIT.BIG_TACTICS,
  name: "Tryhard",
  description: "Different tactics have a bigger impact on defense, offense and threat generation.",
  effects: [
    {
      type: "tacticsModifier",
      mod: 1.5
    }
  ]
}

TraitList[TRAIT.AOE] = {
  id: TRAIT.AOE,
  name: "Big Swing Radius",
  description: "Does less damage but hits all enemies nearby.",
  effects: [
    {
      type: "aoeAttack",
      chance: 1,
      mod: .5,
      range: 128
    }
  ]
}

const unitIndexQuery = defineQuery([UnitIndex])


const conditionChecks = {
  
  maxPartyMembers: ({world, condition}) => {
    
    var numUnits = 0
    
    unitIndexQuery(world).forEach(id=>{
      if (!hasComponent(world, Dead, id))
        numUnits++
    })
    
    return numUnits <= condition.value
  },
  
  targetType: ({world, condition, target}) => {
    return hasComponent(world, BodyType, target) && BodyType.type[target] == condition.value
  },
  
  random: ({condition}) => {
    return Math.random()<condition.chance
  },
  
  targetHealthBelowPercent : ({world, target, condition}) =>{
    if (!hasComponent(world, Attackable, target)) 
      return false
    
    const currentHps = Attackable.currentHitpoints[target]
    const maxHps = Attackable.maxHitpoints[target]
    

    return (currentHps/maxHps) <= condition.value
  },

  selfHealthBelowPercent : ({world, id, condition}) =>{
    return conditionChecks.targetHealthBelowPercent({world, target: id, condition})
  },
  
  selfHealthOverPercent : ({world, id, condition}) =>{
    return !conditionChecks.selfHealthBelowPercent({world, id, condition})
  },
  
  targetHealthOverPercent : ({world, target, condition}) =>{
    return !conditionChecks.targetHealthBelowPercent({world, target, condition})
  },
  
  selfManaBelowPercent : ({world, id, condition}) =>{
    if (!hasComponent(world, Mana, id)) 
      return false
    
    const currentMana = Mana.currentMana[id]
    const maxMana = Mana.maxMana[id]
    

    return (currentMana/maxMana) <= condition.value
  },

}





export const CheckTraitCondition = (data) => {
  const effect = data.effect
  if (!effect || !effect.condition) {
    return true
  }
  
  const condition = effect.condition
  
  return conditionChecks[condition.type]({...data, condition})
}
  
  
  