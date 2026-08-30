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
import { Store, resetMenuStore } from "../helpers/Store" 

import { EventCenter } from "../helpers/EventCenter" 
import { ExperienceManager } from "../helpers/ExperienceManager" 

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
  
  create(data) {
    try { 
    //Background
    this.addEventListers()
    
    const result = data.result !== undefined
      ? data.result
      : {
          winner: -1,
          deadUnits: []
        }
      
    resetMenuStore()
    
    
    this.removeDeadUnits(result.deadUnits)
    
    if (Store.run.party.length == 0 && result.winner != -1) {
      
      this.gameOver(result)
    }
    
    if (result.winner == 0) {
      Store.run.levelIndex++
      this.onDungeonCompleted()
      if (Store.run.levelIndex >= 3) {
        this.gameOver(result)
      }
        
    }
   
    for (const unitIndex of Store.run.party) {
      const unitData = Store.run.units[unitIndex]
      const didLevelUp = ExperienceManager.giveExperience(unitData)
      
      if (didLevelUp) {
        console.log(unitData.name + " gained a level")
      }
    }
    
    
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    
    
    

    this.gameObjects = []
    this.reloadRecruitmentPool()
    this.showGameMenu()
    
    if (result.winner != -1) {
        this.messageLabel.setText(result.winner == 0 ? "You won!" : "You died!")
     }  
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  onDungeonCompleted() {
    Store.run.gold += Store.run.levelIndex*30
    
  }
  
  addEventListers() {
    
    EventCenter.on("toGameMenu", this.showGameMenu, this)
    
  }
  
  gameOver(result) {
    EventCenter.removeAllListeners()
    this.scene.stop("gameMenu")
    this.scene.start("gameOver", result)
  }

  removeDeadUnits(deadUnits) {
    Store.run.party = Store.run.party.filter(index=>(!deadUnits.includes(index)))
  }
  
  reloadRecruitmentPool() {
    Store.menu.recruitmentPool = []
    
    const expHits = Store.run.levelIndex
    for (let i = 0; i < 8; i++) {
      const unitData = UnitFactory.getRandomUnitData()
      Store.menu.recruitmentPool.push(unitData)
      for (let j = 0; j < expHits; j++) {
        ExperienceManager.giveExperience(unitData)
      }
      
    }
    
  }
  
  showGameMenu() {
    
    this.clearGameObjects()
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "", { fontSize: 100 })
    
    this.goldLabel = this.add.text(
      this.cameras.main.width-40, 40, "GOLD: " + Store.run.gold, { fontSize: 80 })
    .setOrigin(1,0)
    
    this.gameObjects.push(this.messageLabel, this.goldLabel)
    
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
    try { 
    EventCenter.removeAllListeners()
    
    if (Store.run.party.length < 0) {
      this.messageLabel.text = "Select at least one hero!"
      return
    }
    
    const heroData = []
    for (const index of Store.run.party)
      heroData.push({...Store.run.units[index]})
    
    
    //var heroData = this.tempHeroData()
    this.scene.start("dungeon", {
      heroData
    })
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}