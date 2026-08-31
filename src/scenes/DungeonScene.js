import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent,
  defineQuery
} from "bitecs"

//factories
import { createDungeonScene } from "../factories/Dungeon"

//tmp Components

import { Action } from "../components/Action"

import { BattleUnit } from "../components/BattleUnit"
import { Attackable } from "../components/Attackable"
import { MeleeAttack } from "../components/MeleeAttack"
import { Color } from "../components/Color" 
import { Position } from "../components/Position" 
import { CheckpointFollower } from "../components/CheckpointFollower" 
import { Healer } from "../components/Healer" 
import { Name } from "../components/Name" 
import { ThreatMod } from "../components/ThreatMod" 
import { Dead } from "../components/Dead"
import { UnitIndex } from "../components/UnitIndex"

//factories
import { UnitFactory } from "../factories/UnitFactory" 

//helpers
import { DungeonSystemManager } from "../helpers/DungeonSystemManager"
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { DungeonGenerator } from "../helpers/DungeonGenerator" 
import { Store, resetDungeonStore } from "../helpers/Store" 

import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 
import { Enemies } from "../data/Enemies" 



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
    
    resetDungeonStore()
    
    this.threatData={}

    //this.add.rectangle(960,540,1920,1080,0x000000).setScrollFactor(0,0)
    
    this.level = DungeonGenerator.getLevel(Store.run.levelIndex)
    const {graphicsScene,camera,renderer} = createDungeonScene(this)
    this.graphicsScene = graphicsScene
    this.camera = camera
    this.renderer = renderer
    
    
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
    
    const deadUnitQuery = defineQuery([Dead, BattleUnit, UnitIndex])

    const deadUnits = []
    deadUnitQuery(this.world).forEach(id=>{
      
      if (BattleUnit.team[id] == 0) {
        deadUnits.push(UnitIndex.index[id])
      }
    })


    result.deadUnits = deadUnits
    

    EventCenter.removeAllListeners()
    this.scene.stop("ui")
    this.scene.start("gameMenu", {result})
  }
  
  setup(heroData) {
    var i = 0
    
    for (const hero of heroData) {
      
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
      
      hero.position = {x, y}
      
      hero.color = 0x00ff00
      hero.team = 0
      hero.checkpointFollower = true
      
      var id = UnitFactory.getUnitEntityFromData(this.world, hero)
      
      i++
    }
    
    
    
  }
  
  setupEnemies() {
  
    
    for (const spawnPoint of this.level.spawnPoints) {
    
      for (let i = 0; i <  spawnPoint[2] ; i++) {
        
        const enemyData = Enemies[spawnPoint[3]]
        
        const unitData = {}
        unitData.team = 1
        
        unitData.level = enemyData.level
        
        unitData.hitpoints = Utils.getRandomBellInt(enemyData.hpMin, enemyData.hpMax, 2)
        unitData.armorClass = Utils.getRandomBellInt(enemyData.acMin, enemyData.acMax ,1)
        
        unitData.damage = Utils.getRandomBellInt(enemyData.damageMin, enemyData.damageMax, 3)
        unitData.delay = Utils.getRandomBellInt(enemyData.delayMin , enemyData.delayMax, 3)
        
        unitData.atk = Utils.getRandomBellInt(enemyData.atkMin, enemyData.atkMax, 3)
        
        unitData.color = 0xff0000
        
        unitData.classType = enemyData.classType
        unitData.enemyIndex = spawnPoint[3]
        
        
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
        unitData.position = {x,y}
        
        
        const id = UnitFactory.getUnitEntityFromData(this.world, unitData)
        
        
      }
    }
    
  }


  
  drawMap() {
    return
    
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
    this.renderer.render(this.graphicsScene, this.camera)
    if (Store.dungeon.paused)
      return
      
    if (dt > 30) {
        //console.log("dt: " + dt)
    }
    
    for (let i = 0; i < Store.dungeon.gameSpeed; i++) {
      this.systemManager.update(dt*GlobalStuff.gameSpeedMod)
    }
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}