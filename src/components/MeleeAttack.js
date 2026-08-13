import { 
  defineComponent,
  Types
} from "bitecs"

export const MeleeAttack = defineComponent({
  damage:Types.ui8,
  delay: Types.ui8,
  coolDown: Types.f32,
  atk: Types.ui8
})