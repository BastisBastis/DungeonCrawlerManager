import { 
  defineComponent,
  Types
} from "bitecs"



export const Attackable = defineComponent({
  maxHitpoints:Types.ui16,
  currentHitpoints:Types.ui16,
  armorClass:Types.ui16
})

