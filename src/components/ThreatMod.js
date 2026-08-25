import { 
  defineComponent,
  Types
} from "bitecs"

export const ThreatMod = defineComponent({
  proximity: Types.f32,
  attack: Types.f32,
  heal: Types.f32,
  other: Types.f32
})