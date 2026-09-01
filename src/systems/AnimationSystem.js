import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

//Components
import { AnimationState, AnimationType } from "../components/AnimationState" 

//Data

import Models from "../data/Models.json"



export const createGraphicsSystem =(world)=>{
  
  const unitQuery=defineQuery([AnimationState])
  const unitEnterQuery=enterQuery(unitQuery)
  
  
  return (world, dt)=>{
    
    unitEnterQuery(world).forEach(id=>{
      
      
    })
    
    
    
    unitQuery(world).forEach(id=>{
      
      
      
    })
    
    
    return world
  }
  
}