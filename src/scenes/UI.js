import Phaser from "phaser"

import {
  hasComponent
} from "bitecs"

//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { NameHelper } from "../helpers/NameHelper" 
import { Store } from "../helpers/Store"

//Components
import { BattleUnit } from "../components/BattleUnit" 
import { Attackable } from "../components/Attackable" 
import { Action } from "../components/Action" 


//Data
import { Palette } from "../data/Palette" 


//UI Elements
import { LogBox } from "../ui/LogBox" 
import { DungeonUnitCard } from "../ui/DungeonUnitCard" 
import { Button } from "../ui/Button" 

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
        
        const name = NameHelper.GetName(this.world, hero.id)
        var duc = new DungeonUnitCard(
          this,
          200 + 300*(i%2),
          120 + 240*Math.floor(i/2),
          {
            ...hero,
            name
            },
          {
            depth: 10,
            
          }
        )
        this.dungeonUnitCards[hero.id] = duc
        i++
      }
      
      this.hostileUnitCards = {}
      
      EventCenter.on("hostileUnitEngaged", this.addHostileUnitCard, this)
      EventCenter.on("unitDied", this.removeUnitCard, this)
      
      const button = new Button(this, 220, 570, "PAUSE", {
        fontSize:48,
        width: 400,
        onClick : ()=>{
          Store.dungeon.paused = !Store.dungeon.paused
          EventCenter.emit("logThreat")
        }
      })
      
      this.speedBtn = new Button(this, 525, 570, "1x", {
        fontSize:48,
        width: 150,
        onClick : ()=>{this.changeGameSpeed()} 
      })
      
      this.setupEventListeners()
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  
  
  }
  
  changeGameSpeed() {
    if (Store.dungeon.gameSpeed== 1) {
      Store.dungeon.gameSpeed=2
      this.speedBtn.label.text="2x"
    }
    else if (Store.dungeon.gameSpeed== 2) {
      Store.dungeon.gameSpeed=4
      this.speedBtn.label.text="4x"
    }
    else {
      Store.dungeon.gameSpeed=1
      this.speedBtn.label.text="1x"
    }
  }
  
  updateUnitTarget(data) {
    //console.log("UI Update Unit Target")
    var card = {
      ...this.dungeonUnitCards,
      ...this.hostileUnitCards
    }[data.id]
    
    if (card) {
      if (data.target == 0)
        card.targetValueLabel.text = ""
      else {
        //console.log(data.target, Name.index[data.target])
        card.targetValueLabel.text = NameHelper.GetName(this.world, data.target)
      }
        
      
      
    }
  }
  
  removeUnitCard(id) {
    
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
  
  
  
  addHostileUnitCard(unitData) {
    try { 
    
    if (this.hostileUnitCards[unitData.id]) {
      return
    }
    
    const name = NameHelper.GetName(this.world, unitData.id)
    const hitpoints = Attackable.maxHitpoints[unitData.id]
    var target = ""
    if (Action.target[unitData.id] > 0) 
      target = UnitNames[Name.index[Action.target[unitData.id]]]
    
    var duc = new DungeonUnitCard(
      this,
      0,
      120,
      {
        ...unitData,
        name,
        hitpoints,
        target
      },
      {
        depth: 10,
        backgroundColor: Palette.red1.hex,
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
    EventCenter.on("targetUpdated", this.updateUnitTarget, this)
    
  }
  
  addLogMessage(string) {
    this.logBox.addLine(string)
  }
  
  
  update(time,dt) {
    
  }
}