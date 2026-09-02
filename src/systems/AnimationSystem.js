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

const animationRules = {}
animationRules[AnimationType.IDLE]={
    interruptable : true,
    loop: true,
    forceInterrupt : false,
    goToNext : true
    }
animationRules[AnimationType.WALK]={
    interruptable : true,
    loop: true,
    forceInterrupt : false,
    goToNext : true
    }
animationRules[AnimationType.ATTACK]= {
    interruptable : false,
    loop: false,
    forceInterrupt : false,
    goToNext : true
    }
animationRules[AnimationType.SPELL]= {
    interruptable : false,
    loop: false,
    forceInterrupt : false,
    goToNext : true
    }
animationRules[AnimationType.DIE]= {
    interruptable : false,
    loop: false,
    forceInterrupt : true,
    goToNext : false
    }



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
    
    gltf.scene.actions.Idle.setLoop(THREE.LoopRepeat)
    gltf.scene.actions.Walking.setLoop(THREE.LoopRepeat)
    gltf.scene.actions.Attack.setLoop(THREE.LoopOnce, 1)
    gltf.scene.actions.Attack.clampWhenFinished = true
    gltf.scene.actions.Spell.setLoop(THREE.LoopOnce, 1)
    gltf.scene.actions.Spell.clampWhenFinished = true
    gltf.scene.actions.Dying.setLoop(THREE.LoopOnce, 1)
    gltf.scene.actions.Dying.clampWhenFinished = true


    
    gltf.scene.actions[animationKeys[AnimationType.IDLE]].reset().play()

    animationMixers[id] = mixer
    
    mixer.addEventListener("finished", (event) => {
      if (!animationRules[AnimationState.current[id]].goToNext)
        return
        
      
      const object = world.scene.objects3d[id]
      const currentAnimationKey = animationKeys[AnimationState.current[id]]
      const requestedAnimationKey = animationKeys[AnimationState.requested[id]]
      object.scene.actions[currentAnimationKey].stop()
      object.scene.actions[requestedAnimationKey].reset().play()
      AnimationState.current[id] = AnimationState.requested[id]
      
    })
  }

  const requestAnimation = (id, animationId) => {
    AnimationState.requested[id] = animationId
    const object = world.scene.objects3d[id]
    const requestedAnimationKey = animationKeys[animationId]
    const currentAnimationKey = animationKeys[AnimationState.current[id]]
    
    if (animationId != AnimationState.current[id] && object) {
      
      if (animationRules[AnimationState.current[id]].interruptable || animationRules[animationId].forceInterrupt) {
        object.scene.actions[currentAnimationKey].stop()
        object.scene.actions[requestedAnimationKey].reset().play()
        AnimationState.current[id] = animationId
        
      }
    }
      

    
  }
  
  const onDamageRequest = data=>{
    if (data.damageType == "melee") {
      requestAnimation(data.source, AnimationType.ATTACK)
    }
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
  EventCenter.on("damageRequest", onDamageRequest)
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