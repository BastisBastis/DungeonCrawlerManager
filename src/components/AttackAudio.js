import { 
  defineComponent,
  Types
} from "bitecs"

export const AttackAudio = defineComponent({
 
  soundDelay: Types.ui16,
  audioKey: Types.ui8
})