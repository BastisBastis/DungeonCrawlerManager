import { 
  defineComponent,
  Types
} from "bitecs"

export const Healer = defineComponent({
  amount:Types.ui8,
  delay: Types.ui8,
  coolDown: Types.f32
})