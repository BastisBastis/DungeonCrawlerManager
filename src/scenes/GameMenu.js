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
import { Popup } from "../ui/Popup" 

//Temp






export default class GameMenu extends Phaser.Scene {
  constructor() {
    super("gameMenu")
  }
  
  preload() {
    
  }
  
  async create(data) {
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
    this.add.image(960,540,"menuBg").setScrollFactor(0,0).setDisplaySize(1920,1080)
    
    if (result.winner == 0) {
      
      Store.run.levelIndex++
      this.onDungeonCompleted()
      if (Store.run.levelIndex >= 3) {
        this.gameOver(result)
        return
      } else {
        var res = await Popup.prompt(this,this.cameras.main.width/2,this.cameras.main.height/2,"You beat the dungeon!", {depth:100})
      }
        
    }
   
   console.log(Store.run.party.length)
    for (const unitIndex of Store.run.party) {
      const unitData = Store.run.units[unitIndex]
      const levelUpData = ExperienceManager.giveExperience(unitData)
      
      if (levelUpData) {
        var res = await Popup.prompt(this,this.cameras.main.width/2,this.cameras.main.height/2,unitData.name + " gained a level!", {depth:100})
        console.log(levelUpData)
      }
    }
    
    
    
    
    
    
    
    

    this.gameObjects = []
    this.reloadRecruitmentPool()
    this.showGameMenu()
    
    
    
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
      this.cameras.main.width-40, 40, "GOLD: " + Store.run.gold, { fontSize: 80, color: Palette.beige1.string})
    .setOrigin(1,0)
    
    this.gameObjects.push(this.messageLabel, this.goldLabel)
    
    
    const dungeonX = this.cameras.main.width - 300
    const dungeonY = this.cameras.main.height - 550
    
    this.gameObjects.push(
      new Button(this, 300, 400, "Tavern", {
        fontSize:48,
        width: 400,
        onClick : ()=>this.showTavern()
        }
      ),
      new Button(this, dungeonX, dungeonY, "Enter Dungeon", {
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
  
  
  async startDungeon() {
    try { 
    EventCenter.removeAllListeners()
    
    if (Store.run.party.length <= 0) {
      var res = await Popup.prompt(this,this.cameras.main.width/2,this.cameras.main.height/2,"Recruit a party from the tavern first!", {depth:100})
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