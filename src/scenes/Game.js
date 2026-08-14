import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories




//helpers


import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 



export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }
  
  preload() {
    
  }
  
  create({
    result =  {
      winner : -1
    }
  }) {
    try { 
    //Background
    console.log("Game Start", result)
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    if (result.winner != -1) {
        this.add.text(380, 300, "WINNER: " + result.winner, { fontSize: 100 })
    }

    this.add.text(380, 700, "Start Dungeon", { fontSize: 100, backgroundColor: "#666", padding: { x: 10, y: 5 } }).setInteractive().on("pointerdown", this.startDungeon, this)
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  startDungeon() {
    this.scene.start("dungeon", {
      levelIndex:0
    })
  }
  
  
    
  
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}