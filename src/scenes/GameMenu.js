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
import { resetMenuStore } from "../helpers/Store"
import { EventCenter } from "../helpers/EventCenter" 

//Data
import { Palette } from "../data/Palette" 

//UI
import { Button } from "../ui/Button"
import { TavernUI } from "../ui/TavernUI" 

//Temp






export default class GameMenu extends Phaser.Scene {
  constructor() {
    super("gameMenu")
  }
  
  preload() {
    
  }
  
  create({
    result =  {
      winner : -1,
      deadUnits : []
    }
  }) {
    try { 
    //Background
    resetMenuStore()
    
    if (result.deadUnits.length == Store.party.length && Store.party.length > 0) {
      console.log("All are dead!")
    }

    this.removeDeadUnits(result.deadUnits)
    
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    
    
    

    this.gameObjects = []
    this.reloadRecruitmentPool()
    this.showGameMenu()
    this.addEventListers()
    if (result.winner != -1) {
        this.messageLabel.setText(result.winner == 0 ? "You won!" : "You died!")
     }  
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  addEventListers() {
    
    EventCenter.on("toGameMenu", this.showGameMenu, this)
    
  }

  removeDeadUnits(deadUnits) {
    Store.party = Store.party.filter(index=>(!deadUnits.includes(index)))
  }
  
  reloadRecruitmentPool() {
    Store.recruitmentPool = []
    for (let i = 0; i < 8; i++) {
      const unitData = UnitFactory.getRandomUnitData()
      Store.recruitmentPool.push(unitData)
    }
    
  }
  
  showGameMenu() {
    
    this.clearGameObjects()
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "", { fontSize: 100 })
    this.gameObjects.push(this.messageLabel)
    
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
        onClick : ()=>this.showTavern()
        }
      ),
      new Button(this, startX+deltaX*2, startY+deltaY*1, "Enter Dungeon", {
        fontSize:48,
        width: 400,
        onClick : ()=>{this.startDungeon() }
        }
      )
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
    
    
    if (Store.party.length < 0) {
      this.messageLabel.text = "Select at least one hero!"
      return
    }
    
    const heroData = []
    for (const index of Store.party)
      heroData.push({...Store.units[index]})
    
    
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