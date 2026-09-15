import { 
  defineComponent,
  Types
} from "bitecs"



export const Attackable = defineComponent({
  maxHitpoints:Types.f32,
  currentHitpoints:Types.f32,
  armorClass:Types.ui16
})

