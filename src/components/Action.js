import { 
  defineComponent,
  Types
} from "bitecs"

export const Action = defineComponent({
  action:Types.i8,
  target: Types.i16
})

export const ActionType = {
  IDLE: 0,
  MOVE: 1,
  ATTACK: 2,
  HEAL: 3
}