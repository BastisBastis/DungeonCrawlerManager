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
import { SFXManager } from "../helpers/sfxManager" 
import {MusicManager} from "../helpers/MusicManager" 


//Data
import { Palette } from "../data/Palette" 

//UI
import { Button } from "../ui/Button"
import { TavernUI } from "../ui/TavernUI" 
import { Popup } from "../ui/Popup" 
import { DungeonGenerator } from "../helpers/DungeonGenerator"
import { DungeonSummaryPopup } from "../ui/DungeonSummaryPopup"
import { getDungeonSummary } from "../systems/StatSystem"
import { StatsMenu } from "../ui/Stats/StatsMenu" 
import { TraitAwardPopup } from "../ui/Popups/TraitAwardPopup" 


//Data
import { TraitList } from "../data/Traits" 
import { TacticsMenu } from "../ui/TacticsMenu"






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
    
    this.sfxManager = new SFXManager(this)
    
    const result = data.result !== undefined
      ? data.result
      : {
          winner: -1,
          deadUnits: [],
          traitsToAdd: []
        }
      
    resetMenuStore()
    
    
    
    this.removeDeadUnits(result.deadUnits)
    
    
    
    if (Store.run.party.length == 0 && result.winner != -1) {
      
      this.gameOver(result)
      return
    }

    MusicManager.play(0,this)
    
    this.add.image(960,540,"menuBg").setScrollFactor(0,0).setDisplaySize(1920,1080)
    
    if (result.winner == 0) {
      await this.handleNewTraits(result.traitsToAdd)
      Store.run.levelIndex++
      this.onDungeonCompleted()
      if (Store.run.levelIndex >= DungeonGenerator.getNumLevels()) {
        this.gameOver(result)
        return
      } else {
        await DungeonSummaryPopup.prompt(this,this.cameras.main.width/2,this.cameras.main.height/2,getDungeonSummary(), {depth:100})
      }
        
    }
   
   
    for (const unitIndex of Store.run.party) {
      const unitData = Store.run.units[unitIndex]
      const levelUpData = ExperienceManager.giveExperience(unitData)
      
      if (levelUpData) {
        var res = await Popup.prompt(this,this.cameras.main.width/2,this.cameras.main.height/2,unitData.name + " gained a level!", {depth:100})
        //console.log(levelUpData)
      }
    }
    
    
    
    
    
    
    
    

    this.gameObjects = []
    this.reloadRecruitmentPool()
    this.showGameMenu()
    
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  onDungeonCompleted() {
    
    var goldMod = 1
    for (const unitIndex of Store.run.party) {
      const unit = Store.run.units[unitIndex]
      for (const traitIndex of unit.traits) {
        
        const trait= TraitList[traitIndex]
          for (const effect of trait.effects) {
            if (effect.type == "goldMod") {
            goldMod*=effect.mod
          }
        }
        
        
      }
    }
    
    Store.run.gold += Math.round((Store.run.levelIndex+1) *10 * goldMod)
    
  }
  
  addEventListers() {
    
    EventCenter.on("toGameMenu", this.showGameMenu, this)
    
  }
  
  gameOver(result) {
    EventCenter.removeAllListeners()
    this.scene.stop("gameMenu")
    this.scene.start("gameOver", result)
  }
  
  async handleNewTraits(traitsToAdd) {
    
    for (const traitToAdd of traitsToAdd) {
      
      if (Store.run.party.includes(traitToAdd.unitIndex) && !Store.run.units[traitToAdd.unitIndex].traits.includes(traitToAdd.traitIndex)) {
        

        await TraitAwardPopup.prompt(
          this,
          this.cameras.main.width/2,
          this.cameras.main.height/2,
          traitToAdd
        )
        
        Store.run.units[traitToAdd.unitIndex].traits.push(traitToAdd.traitIndex)
        
      }
      
    }
    
  }

  removeDeadUnits(deadUnits) {
    Store.run.party = Store.run.party.filter(index=>(!deadUnits.includes(index)))
    Store.run.deadUnits.push(...deadUnits)
  }
  
  reloadRecruitmentPool() {
    Store.menu.recruitmentPool = []
    
    const classCount = {}
    const maxPerClass = 3
    
    const expHits = Store.run.levelIndex
    for (let i = 0; i < 8; i++) {
      var foundUnit = false
      
      var unitData
      
      while (!foundUnit) {
        unitData = UnitFactory.getRandomUnitData()
        if (!classCount[unitData.classType]) {
          classCount[unitData.classType]= 1
          foundUnit = true
        }
        else if (classCount[unitData.classType]<maxPerClass){
          classCount[unitData.classType]++
          foundUnit=true
        }
      }
      
      Store.menu.recruitmentPool.push(unitData)
      for (let j = 0; j < expHits; j++) {
        ExperienceManager.giveExperience(unitData)
      }
      
    }
    
  }
  
  showGameMenu() {
    try { 
    this.clearGameObjects()
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "", { fontSize: 100 })
    
    this.goldLabel = this.add.text(
      this.cameras.main.width-40, 40, "GOLD: " + Math.floor(Store.run.gold), { 
      fontSize: 80, 
      color: Palette.beige1.string,
      fontFamily: GlobalStuff.FontFamily
    })
    .setOrigin(1,0)
    
    this.gameObjects.push(this.messageLabel, this.goldLabel)
    
    
    const dungeonX = this.cameras.main.width - 300
    const dungeonY = this.cameras.main.height - 500
    
    const statsPos = {
      x: this.cameras.main.width - 670,
      y: 340
    }

    const tacticsPos = {
      x: 300,
      y: 800
    }
    
    const btnConfig = {
      width: 320,
      height: 80,
      fontSize: 40
    }
    
    
    this.gameObjects.push(
      new Button(this, 300, 400, "Tavern", {
        ...btnConfig,
        onClick : ()=>this.showTavern()
        }
      ),
      new Button(this, dungeonX, dungeonY, "Enter Dungeon", {
        ...btnConfig,
        onClick : ()=>{this.startDungeon() }
        }
      )
      
    )
    const statsButton = new Button(this, statsPos.x, statsPos.y, "Statistics", {
        ...btnConfig,
        onClick : ()=>{this.showStats() }
        }
      ).setVisible(Store.run.levelIndex>0)
    this.gameObjects.push(statsButton)

    const tacticsButton = new Button(this, tacticsPos.x, tacticsPos.y, "Tactics", {
        ...btnConfig,
        onClick : ()=>{this.showTactics() }
        }
      ).setVisible(Store.run.party.length>0)
    this.gameObjects.push(tacticsButton)
    
    //this.addEventListeners
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  showTactics() {
    this.clearGameObjects()
    this.gameObjects.push(
      new TacticsMenu(
        this,
        this.cameras.main.width/2,
        this.cameras.main.height/2
      )
    )
  }
  
  showStats() {
    try { 
    this.clearGameObjects()
    this.gameObjects.push(new StatsMenu(this))
    } catch (er) {console.log(er.message,er.stack); throw er} 
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
    

    if (Store.run.party.length <= 0) {
      var res = await Popup.prompt(this,this.cameras.main.width/2,this.cameras.main.height/2,"Recruit a party from the tavern first!", {depth:100})
      return
    }
    EventCenter.removeAllListeners()
    
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