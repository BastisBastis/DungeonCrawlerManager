import Phaser from "phaser"


//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 

//Data
import { Palette } from "../data/Palette" 

//UI Elements
import { LogBox } from "../ui/LogBox" 

export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  preload() {
    
  }
  
  create({}) {
    try { 
      this.timer = 1000
      
      
      this.logBox = new LogBox(
        this, 
        this.cameras.main.width/2, 
        this.cameras.main.height-50-250, 
        {
          width: this.cameras.main.width-100,
          height: 500
        }
      )
      this.logBox.addLine("Welcome")
      
      this.setupEventListeners()
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  
  
  
  }
  
  setupEventListeners() {
    
    EventCenter.on("addLogMessage", this.addLogMessage, this)
    
    
  }
  
  addLogMessage(string) {
    this.logBox.addLine(string)
  }
  
  
  update(time,dt) {
    
  }
}