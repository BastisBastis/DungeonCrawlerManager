import { 
  defineComponent,
  Types
} from "bitecs"



export const AnimationState = defineComponent({
  current:Types.ui8,
  requested:Types.ui8
})


export const AnimationType = {
  IDLE:0,
  WALK:1,
  ATTACK:2,
  SPELL:3,
  DIE:4
}