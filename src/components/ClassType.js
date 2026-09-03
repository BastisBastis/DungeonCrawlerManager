import { 
  defineComponent,
  Types
} from "bitecs"

export const ClassType = defineComponent({
  type:Types.ui8
})

export const UnitClass = {
  WARRIOR : "Warrior",
  CLERIC : "Cleric",
  ROGUE : "Rogue"
}

export const ClassIds = {
  0 : "Warrior",
  1 : "Cleric",
  2 : "Rogue"
}

export const ClassIdFromName = {
  "Warrior" : 0,
  "Cleric" : 1,
  "Rogue" : 2
}