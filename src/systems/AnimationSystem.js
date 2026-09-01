import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

import * as THREE from "three"

//Components
import { AnimationState, AnimationType } from "../components/AnimationState" 

//Helpers
import { EventCenter } from "../helpers/EventCenter"

//Data

import Models from "../data/Models.json"

const animationKeys = {}
animationKeys[AnimationType.IDLE] = "Idle"
animationKeys[AnimationType.WALK] = "Walking"
animationKeys[AnimationType.ATTACK] = "Attack"
animationKeys[AnimationType.SPELL] = "Spell"
animationKeys[AnimationType.DIE] = "Dying"



export const createAnimationSystem =(world)=>{

  const animationMixers = {}

  const onModelLoaded= (data) => {
    const id = data.id
    const gltf = data.gltf
    const mixer = new THREE.AnimationMixer(gltf.scene)
    gltf.scene.actions = {}

    gltf.animations.forEach(clip => {
      gltf.scene.actions[clip.name] = mixer.clipAction(clip)
    })
    gltf.scene.actions[animationKeys[AnimationType.IDLE]].reset().play()

    animationMixers[id] = mixer
  }

  const requestAnimation = (id, animationId) => {
    AnimationState.requested[id] = animationId
    if (animationId != AnimationState.current[id] && world.scene.objects3d[id] && world.scene.objects3d[id].scene.actions) {
      world.scene.objects3d[id].scene.actions[animationKeys[animationId]].reset().play()
      AnimationState.current[id] = animationId
    }
      

    if (id == 3)
        console.log(animationId)
  }

  EventCenter.on("modelLoaded", (data)=>{
    onModelLoaded(data)
  })

  EventCenter.on("unitIsRunning", id=>{
    requestAnimation(id, AnimationType.WALK)
  }) 
  EventCenter.on("unitIsIdle", (id)=>{
    requestAnimation(id, AnimationType.IDLE)
  })
  EventCenter.on("unitIsAttacking", (id)=>{
    requestAnimation(id, AnimationType.ATTACK)
  })
  EventCenter.on("unitIsCasting", (id)=>{
    requestAnimation(id, AnimationType.SPELL)
  })
  EventCenter.on("unitDied", (id)=>{
    requestAnimation(id, AnimationType.DIE)
  })
  
  const unitQuery=defineQuery([AnimationState])
  const unitEnterQuery=enterQuery(unitQuery)
  
  
  return (world, dt)=>{
    
    unitEnterQuery(world).forEach(id=>{
      
      
    })
    
    
    
    unitQuery(world).forEach(id=>{
      
      
      
    })
    
    Object.values(animationMixers).forEach(mixer=>{
      mixer.update(dt/1000)
    })

    return world
  }
  
}