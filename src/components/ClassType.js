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