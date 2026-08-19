import Phaser from "phaser"



//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 

//Components
import { BattleUnit } from "../components/BattleUnit" 
import { Attackable } from "../components/Attackable" 

//Data
import { Palette } from "../data/Palette" 

//UI Elements
import { LogBox } from "../ui/LogBox" 
import { DungeonUnitCard } from "../ui/DungeonUnitCard" 

export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  preload() {
    
  }
  
  create({
    heroData,
    world
  }) {
    try { 
      this.timer = 1000
      this.world = world
      
      
      this.logBox = new LogBox(
        this, 
        500, 
        this.cameras.main.height-10-200, 
        {
          width: 1000,
          height: 400,
          fontSize: 32
        }
      )
      this.logBox.addLine("Welcome")
      this.dungeonUnitCards = {}
      
      var i = 0
      for (const hero of heroData) {
        var duc = new DungeonUnitCard(
          this,
          200 + 300*i,
          120,
          hero,
          {
            depth: 10
          }
        )
        this.dungeonUnitCards[hero.id] = duc
        i++
      }
      
      this.hostileUnitCards = {}
      
      EventCenter.on("hostileUnitEngaged", this.addHostileUnitCard, this)
      EventCenter.on("unitDied", this.removeUnitCard, this)
      
      
      this.setupEventListeners()
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  
  
  
  }
  
  removeUnitCard(id) {
    console.log("remove unit card: " + id)
    if (this.dungeonUnitCards[id]) {
      this.dungeonUnitCards[id].destroy()
      delete this.dungeonUnitCards[id]
    }
    
    if (this.hostileUnitCards[id]) {
      this.hostileUnitCards[id].destroy()
      delete this.hostileUnitCards[id]
    }
    this.layoutHostileCards()
  }
  
  updateDungeonUnitCardHitpoints(data) {
    
    var card = {
      ...this.dungeonUnitCards,
      ...this.hostileUnitCards
    }[data.id]
    
    if (card) {
      
      //card.levelValueLabel.text = data.level
      card.hpValueLabel.text = data.currentHitpoints+"/"+data.maxHitpoints
      
      
    }
    
    
  }
  
  setupDungeonUnitCards(unitCardDataCollection) 
  {
    
    for (const unitCardData of unitCardDataCollection) {
      
      
      
    }
    
  }
  
  addHostileUnitCard(unitData) {
    try { 
    
    const name = "Enemy"
    const hitpoints = Attackable.maxHitpoints[unitData.id]
    
    var duc = new DungeonUnitCard(
      this,
      0,
      120,
      {
        ...unitData,
        name,
        hitpoints,
      },
      {
        depth: 10,
        backgroundColor: 0x881122,
        fontColor: "#dddddd"
      }
    )
    
    
    
    
    this.hostileUnitCards[unitData.id] = duc
    
    
    this.layoutHostileCards()
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  layoutHostileCards() {
    var i = 0
    
    for (const card of Object.values(this.hostileUnitCards)) {
      
      card.x = this.cameras.main.width - card.width/2 - card.width*i
      
      card.layout()
      i++
    }
  }
  
  
  setupEventListeners() {
    
    EventCenter.on("addLogMessage", this.addLogMessage, this)
    EventCenter.on("updateHitpoints", this.updateDungeonUnitCardHitpoints, this)
    
    
  }
  
  addLogMessage(string) {
    this.logBox.addLine(string)
  }
  
  
  update(time,dt) {
    
  }
}