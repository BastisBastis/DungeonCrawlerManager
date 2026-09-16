import Phaser from "phaser"

//helpers

import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 

import { Button } from "../ui/Button"

//Temp




export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("mainMenu")
  }
  
  preload() {
    
  }
  
  create() {
    try { 
    //Background
    
   
    
      
      
    this.add.rectangle(960,540,1920,1080,Palette.purple2.hex).setScrollFactor(0,0)
    
    
    const button = new Button(this, this.cameras.main.width/2, this.cameras.main.height*.7, "NEW GAME", {
      fontSize:48,
      width: 400,
      onClick : ()=>{this.newGame()
      }
    })    

    this.add.image(this.cameras.main.width/2, 300, "logo")
    .setOrigin(.5,.5)
    .setScale(1.5)

    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  newGame() {
    
    this.scene.stop()
    this.scene.start("gameMenu", {})
  }
  
  
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}