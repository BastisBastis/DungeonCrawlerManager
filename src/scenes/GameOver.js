import Phaser from "phaser"

//helpers

import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 
import { UnitNames } from "../data/UnitNames" 

//UI

import { Button } from "../ui/Button"

import { resetStore } from "../helpers/Store" 





export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver")
  }
  
  preload() {
    
  }
  
  create(result) {
    try { 
    //Background
   
      
      
  this.add.image(960,540,"menuBg").setScrollFactor(0,0).setDisplaySize(1920,1080)
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "", { fontSize: 100 })
    
    
    

    

    const button = new Button(this, 380, 700, "Restart", {
      fontSize:48,
      width: 400,
      onClick : ()=>{this.restart()
      }
    })
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

   restart() {
    try { 
    resetStore()
    this.scene.stop()
    this.scene.start("gameMenu", {})
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}