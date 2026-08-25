import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories

import { UnitFactory } from "../factories/UnitFactory" 


//helpers

import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"
import { Store } from "../helpers/Store" 

//Data
import { Palette } from "../data/Palette" 

//UI
import { Button } from "../ui/Button"
import { TavernUI } from "../ui/Tavern" 

//Temp






export default class GameMenu extends Phaser.Scene {
  constructor() {
    super("gameMenu")
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
    
    
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "", { fontSize: 100 })
    
    if (result.winner != -1) {
        this.messageLabel.setText(result.winner == 0 ? "You won!" : "You died!")
     }

    this.gameObjects = []
    this.reloadRecruitmentPool()
    this.showGameMenu()

    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  reloadRecruitmentPool() {
    Store.recruitmentPool = []
    for (let i = 0; i < 8; i++) {
      const unitData = UnitFactory.getRandomUnitData()
      Store.recruitmentPool.push(unitData)
    }
  }
  
  showGameMenu() {
    
    const rows = 2
    const cols = 3
    
    const deltaY = this.cameras.main.height/rows
    
    const startY = deltaY/2
    
    const deltaX = this.cameras.main.width/cols
    const startX = deltaX/2
    
    this.gameObjects.push(
      new Button(this, startX, startY, "Tavern", {
        fontSize:48,
        width: 400,
        onClick : this.showTavern
        }
      }),
      new Button(this, startX+deltaX*2, startY+deltaY*1, "Enter Dungeon", {
        fontSize:48,
        width: 400,
        onClick : ()=>{this.startDungeon()
        }
      })
    )
    
    this.addEventListeners
    
    
  }

  showTavern() {
    this.clearGameObjects()
    this.gameObjects.push(new TavernUI(this))
  }
  
  clearGameObjects() {
    this.gameObjects.forEach(object=>{
      object.destroy()
    })
    this.gameObjects = []
  }
  
  
  startDungeon() {
    
    
    if (this.selectedUnits.length <1) {
      this.messageLabel.text = "Select at least one hero!"
      return
    }
    
    const heroData = []
    for (const index of this.selectedUnits) {
      heroData.push(this.unitCards[index].data)
    }
    
    //var heroData = this.tempHeroData()
    this.scene.start("dungeon", {
      heroData
    })
  }
  
  
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}