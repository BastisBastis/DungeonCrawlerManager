import { 
  defineComponent,
  Types
} from "bitecs"



export const Mana = defineComponent({
  currentMana:Types.ui16,
  maxMana:Types.ui16
})

