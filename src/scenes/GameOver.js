import Phaser from "phaser"

//helpers

import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"
import { MusicManager } from "../helpers/MusicManager"

import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 
import { UnitNames } from "../data/UnitNames" 

//UI

import { Button } from "../ui/Button"

import { resetRunStore } from "../helpers/Store" 
import { EventCenter } from "../helpers/EventCenter"





export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver")
  }
  
  preload() {
    
  }
  
  create(result) {
    try { 
    //Background
   
    MusicManager.play(0, this)
    this.sfxManager = new SFXManager(this)
      
  this.add.image(960,540,"menuBg").setScrollFactor(0,0).setDisplaySize(1920,1080)
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "All your units died.", { fontSize: 100 })
    
    
    if (result.winner == 0)
      this.messageLabel.text = "You beat the game!"

    

    const button = new Button(this, this.cameras.main.width/2, this.cameras.main.height/2, "Main Menu", {
      fontSize:48,
      width: 400,
      onClick : ()=>{this.restart()
      }
    })
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

   restart() {
    try { 
    resetRunStore()
    EventCenter.removeAllListeners()
    this.scene.stop()
    this.scene.start("mainMenu", {})
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}