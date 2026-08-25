import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories




//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 
import { UnitNames } from "../data/UnitNames" 

//UI
import { DungeonUnitCard } from "../ui/DungeonUnitCard"
import { MenuUnitCard } from "../ui/MenuUnitCard" 
import { Button } from "../ui/Button"

//Temp
import { UnitClass } from "../components/ClassType"






export default class TavernUI {
  
  constructor(scene) {
  
  
    try { 
    //Background
    this.scene=scene
    
    this.gameObjects = []
    const rows = 3
    const cols = 3
    
    const deltaY = this.scene.cameras.main.height/rows
    
    const startY = deltaY/2
    
    const deltaX = this.scene.cameras.main.width/cols
    const startX = deltaX/2
      
    
    
    

    this.gameObjects.push(
      new Button(this.scene, startX, startY, "Back", {
        fontSize:48,
        width: 400,
        onClick : ()=>{
          EventCenter.emit("toGameMenu")
        }
      })
    )
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  
  
  destroy() {
    this.gameObjects.forEach(object=>object.destroy())
    this.gameObjects=[]
  }
  
}