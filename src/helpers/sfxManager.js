import Phaser from "phaser"

import {EventCenter} from "./EventCenter"
import {GlobalStuff} from "./GlobalStuff"
import * as Utils from "../helpers/Utils" 
import { Store } from "../helpers/Store" 

//Sounds
import Sword1 from "../assets/sfx/sword1.mp3"
import Sword2 from "../assets/sfx/sword2.mp3"
import Sword3 from "../assets/sfx/sword3.mp3"
import Sword4 from "../assets/sfx/sword4.mp3"
import Sword5 from "../assets/sfx/sword5.mp3"
import Hit1 from "../assets/sfx/hit1.mp3"
import Hit2 from "../assets/sfx/hit2.mp3"
import Hit3 from "../assets/sfx/hit3.mp3"
import Hit4 from "../assets/sfx/hit4.mp3"
import Hit5 from "../assets/sfx/hit5.mp3"
import Die from "../assets/sfx/die.mp3"
import Hover from "../assets/sfx/hover1.m4a"
import Click from "../assets/sfx/click1.m4a"

export const AudioKeys = {}
AudioKeys[0] = "sword"
AudioKeys[1] = "hit"
AudioKeys[2] = "die"

export class SFXManager {
  constructor(scene) {
    scene.sound.setVolume(0.7)
    this.sounds={}
    this.volumes={
      sword1:0.4,
      sword2:0.4,
      sword3:0.4,
      sword4:0.4,
      sword5:0.4,
      hit1:0.4,
      hit2:0.4,
      hit3:0.4,
      hit4:0.4,
      hit5:0.4,
      die:0.4,
      hover:0.4,
      click:0.4
    }
    this.playbackRates = {
      sword1: [.9,1.1],
      sword2: [.9,1.1],
      sword3: [.9,1.1],
      sword4: [.9,1.1],
      sword5: [.9,1.1],
      hit1: [.9,1.1],
      hit2: [.9,1.1],
      hit3: [.9,1.1],
      hit4: [.9,1.1],
      hit5: [.9,1.1],
      die: [.9,1.1],
      hover: [.9,1.1],
      click: [.9,1.1],
    }


    
    this.sounds["sword1"]=scene.sound.add("sword1")
    this.sounds["sword2"]=scene.sound.add("sword2")
    this.sounds["sword3"]=scene.sound.add("sword3")
    this.sounds["sword4"]=scene.sound.add("sword4")
    this.sounds["sword5"]=scene.sound.add("sword5")
    for (let i = 1; i < 6; i++)
      this.sounds["hit"+i]=scene.sound.add("hit"+i)
    this.sounds["die"]=scene.sound.add("die")
    this.sounds["hover"]=scene.sound.add("hover")
    this.sounds["click"]=scene.sound.add("click")
    
    
    EventCenter.on("playAudio",data=>{
      
    try { 
      
      if (!data.key)
        data.key = AudioKeys[data.index]
      
      //console.log(data.key)
    
      if (data.key=="sword")
          data.key+=Utils.getRandomInt(1,6)
       
      if (data.key=="hit")
          data.key+=Utils.getRandomInt(1,6)
        
      //console.log(data.key)
      if (!this.sounds[data.key])
        return
      
      let rate=1
      if (data.rate) {
        rate=data.rate
      }
      else if (this.playbackRates[data.key]) {
        if (isNaN(this.playbackRates[data.key])) {
          const min=this.playbackRates[data.key][0]
          const max=this.playbackRates[data.key][1]
          rate = min+(max-min)*Math.random()
          
        } else {
          rate=this.playbackRates[data.key]
        }
      }
      
      if (data.key.includes("sword")) {
        rate *= 1 + (Store.dungeon.gameSpeed)/4
      }
      else if (data.key.includes("hit")) {
        rate *= 1 + (Store.dungeon.gameSpeed)/4
      }
      //console.log(data.key, rate, this.volumes[data.key]*GlobalStuff.SFXVolume/10)
    
      this.sounds[data.key].play({
        
        volume:this.volumes[data.key]*GlobalStuff.SFXVolume/10 ,
        rate
      }) 
    } catch (er) {console.log(er.message,er.stack); throw er} 
    })
    
    EventCenter.on("stopAudio",data=>{
      
      scene.tweens.add({
        targets:this.sounds[data.key],
        duration:100,
        volume:0,
        onComplete:()=>{
          this.sounds[data.key].stop() 
        }
      })
      
    })
    
  }
  
  static preload(scene) {
    scene.load.audio("sword1",Sword1)
    scene.load.audio("sword2",Sword2)
    scene.load.audio("sword3",Sword3)
    scene.load.audio("sword4",Sword4)
    scene.load.audio("sword5",Sword5)
    scene.load.audio("hit1",Hit1)
    scene.load.audio("hit2",Hit2)
    scene.load.audio("hit3",Hit3)
    scene.load.audio("hit4",Hit4)
    scene.load.audio("hit5",Hit5)
    scene.load.audio("die",Die)
    scene.load.audio("hover",Hover)
    scene.load.audio("click",Click)
    
  }
}



