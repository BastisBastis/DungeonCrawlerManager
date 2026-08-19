import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories

//tmp Components

import { Action } from "../components/Action"

import { BattleUnit } from "../components/BattleUnit"
import { Attackable } from "../components/Attackable"
import { MeleeAttack } from "../components/MeleeAttack"
import { Color } from "../components/Color" 
import { Position } from "../components/Position" 
import { CheckpointFollower } from "../components/CheckpointFollower" 

//helpers
import { DungeonSystemManager } from "../helpers/DungeonSystemManager"
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { DungeonGenerator } from "../helpers/DungeonGenerator" 

import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 



export default class DungeonScene extends Phaser.Scene {
  constructor() {
    super("dungeon")
  }
  
  preload() {
    
  }
  
  create({
    heroData = []
  }) {
    try { 
    //Background
    
    

    EventCenter.on("allUnitsDead", this.allUnitsDead, this)
    EventCenter.on("goalReached", this.goalReached, this)
    
    

    this.add.rectangle(960,540,1920,1080,0x000000).setScrollFactor(0,0)
    
    this.level = DungeonGenerator.getLevel(0)
    
    
    this.world=createWorld()
    this.world.scene=this
    addEntity(this.world) //reserve id 0
    this.setup(heroData)
    
    
    this.systemManager=new DungeonSystemManager(this.world)
    this.scene.launch("ui", {heroData, world: this.world})
    
    this.drawMap()
    
    setTimeout(()=>{this.setupEnemies()}, 10)
    //this.tempBattleStuff()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  allUnitsDead(team) {
    if (team == 0) {
      this.exitDungeon({
        winner: 1
      })
    }
  }
  
  goalReached() {
    this.exitDungeon({
      winner: 0
    })
  }

  exitDungeon(result) {
    console.log("Game ended", result)
    EventCenter.removeAllListeners()
    this.scene.stop("ui")
    this.scene.start("game", {result})
  }
  
  setup(heroData) {
    var i = 0
    for (const hero of heroData) {
      const id = addEntity(this.world)
      hero.id = id
      addComponent(this.world, Action, id)
      addComponent(this.world, BattleUnit, id)
      addComponent(this.world, Attackable, id)
      addComponent(this.world, MeleeAttack, id)
      addComponent(this.world, Position, id)
      addComponent(this.world, Color, id)
      addComponent(this.world, CheckpointFollower, id)
      
      CheckpointFollower.index[id] = 0
      
      Action.target[id] = 0
      BattleUnit.team[id] = 0
      
      
      
      Attackable.maxHitpoints[id] = hero.hitpoints
      Attackable.currentHitpoints[id] = Attackable.maxHitpoints[id]
      Attackable.armorClass[id] = hero.armorClass
      
      MeleeAttack.damage[id] = hero.damage
      MeleeAttack.delay[id] = hero.delay
      MeleeAttack.coolDown[id] = 0
      MeleeAttack.atk[id] = hero.atk
    
      var x = this.level.playerSpawn.x * this.level.cellSize
      var y = this.level.playerSpawn.y * this.level.cellSize
      
      if (i > 0) {
        if (i < 3)
          y-=this.level.cellSize/4
        else
          y+=this.level.cellSize/4
        
        if (i % 2 == 1) {
          x-=this.level.cellSize/4
        } else {
          x+=this.level.cellSize/4
        }
      }
      Position.x[id] = x
      Position.y[id] = y
      
      Color.hex[id] = 0x00ff00
        
  
      
      
      if (GlobalStuff.verboseLog >0)
        EventCenter.emit("addLogMessage", "id: " + id + " Team: " + BattleUnit.team[id] + " HP: " + Attackable.maxHitpoints[id] + " AC: " + Attackable.armorClass[id] + " Dmg: " + MeleeAttack.damage[id] + " Delay: " + MeleeAttack.delay[id] + " ATK: " + MeleeAttack.atk[id])
        
      i++
    }
    
    
    
  }
  
  setupEnemies() {
    
    var numEnemies = 4
    
    for (const spawnPoint of this.level.spawnPoints) {
    
      for (let i = 0; i <  spawnPoint[2] ; i++) {
        const id = addEntity(this.world)
        //console.log(BattleTarget, BattleUnit, Attackable, MeleeAttack)
        
        addComponent(this.world, Action, id)
        addComponent(this.world, BattleUnit, id)
        addComponent(this.world, Attackable, id)
        addComponent(this.world, MeleeAttack, id)
        addComponent(this.world, Color, id)
        addComponent(this.world, Position, id)
        
        Action.target[id] = 0
        BattleUnit.team[id] = 1
        
        
        
        Attackable.maxHitpoints[id] = Utils.getRandomBellInt(30, 50, 2)
        Attackable.currentHitpoints[id] = Attackable.maxHitpoints[id]
        Attackable.armorClass[id] = Utils.getRandomBellInt(2, 6,1)
        
        MeleeAttack.damage[id] = Utils.getRandomBellInt(8,15,3)
        MeleeAttack.delay[id] = Utils.getRandomBellInt(20,24, 3)
        MeleeAttack.coolDown[id] = 0
        MeleeAttack.atk[id] = Utils.getRandomBellInt(8,15, 3)
        
        Color.hex[id] = 0xff0000
        
        var x = spawnPoint[0] * this.level.cellSize
        var y = spawnPoint[1] * this.level.cellSize
        
        if (i > 0) {
          if (i < 3)
            y-=this.level.cellSize/4
          else
            y+=this.level.cellSize/4
          
          if (i % 2 == 1) {
            x-=this.level.cellSize/4
          } else {
            x+=this.level.cellSize/4
          }
        }
        Position.x[id] = x
        Position.y[id] = y
        
        
        
        
        if (GlobalStuff.verboseLog >0)
          EventCenter.emit("addLogMessage", "id: " + id + " Team: " + BattleUnit.team[id] + " HP: " + Attackable.maxHitpoints[id] + " AC: " + Attackable.armorClass[id] + " Dmg: " + MeleeAttack.damage[id] + " Delay: " + MeleeAttack.delay[id] + " ATK: " + MeleeAttack.atk[id])
        
      }
    }
    
  }
  
  drawMap() {
    
    
    for (let col = 0; col < this.level.width; col++) {
      
      
      for (let row = 0; row < this.level.height; row++) {
        var color = 0xcc9988
        if (!this.level.map[col][row].walkable) {
          color = 0x000000
        }
        var x = col*this.level.cellSize
        var y = row*this.level.cellSize
        
        this.add.rectangle(x, y, this.level.cellSize, this.level.cellSize, color)
          .setDepth(50)
          .setStrokeStyle(1, 0x222222);
        
      }
    }
  }
  
  update(time,dt) {
    try { 
    this.systemManager.update(dt * GlobalStuff.gameSpeedMod)
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}