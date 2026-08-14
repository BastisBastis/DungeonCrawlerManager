import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories

//tmp Components

import { BattleTarget } from "../components/BattleTarget"
import { BattleUnit } from "../components/BattleUnit"
import { Attackable } from "../components/Attackable"
import { MeleeAttack } from "../components/MeleeAttack"


//helpers
import { DungeonSystemManager } from "../helpers/DungeonSystemManager"
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

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
    levelIndex = 0
  }) {
    try { 
    //Background
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    this.world=createWorld()
    this.world.scene=this
    addEntity(this.world) //reserve id 0
    
    
    
    this.systemManager=new DungeonSystemManager(this.world)
    this.scene.launch("ui")
    
    setTimeout(()=>{this.tempBattleStuff()}, 1)
    //this.tempBattleStuff()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  tempBattleStuff() {
    
    var numTeam1 = 1
    var numTeam2 = 1
    
    for (let i = 0; i<numTeam1 + numTeam2 ; i++) {
      const id = addEntity(this.world)
      //console.log(BattleTarget, BattleUnit, Attackable, MeleeAttack)
      
      addComponent(this.world, BattleTarget, id)
      addComponent(this.world, BattleUnit, id)
      addComponent(this.world, Attackable, id)
      addComponent(this.world, MeleeAttack, id)
      BattleTarget.targetEntity[id] = 0
      BattleUnit.team[id] = i < numTeam1 ? 0 : 1
      
      console.log(Utils.getRandomBellInt(50, 100, 3))
      
      Attackable.maxHitpoints[id] = Utils.getRandomBellInt(50, 100, 3)
      Attackable.currentHitpoints[id] = Attackable.maxHitpoints[id]
      Attackable.armorClass[id] = Utils.getRandomBellInt(8,15,3)
      
      MeleeAttack.damage[id] = Utils.getRandomBellInt(8,15,3)
      MeleeAttack.delay[id] = Utils.getRandomBellInt(15,24, 3)
      MeleeAttack.coolDown[id] = 0
      MeleeAttack.atk[id] = Utils.getRandomBellInt(8,15, 3)
      
      
      
      
      
      EventCenter.emit("addLogMessage", "id: " + id + " Team: " + BattleUnit.team[id] + " HP: " + Attackable.maxHitpoints[id] + " AC: " + Attackable.armorClass[id] + " Dmg: " + MeleeAttack.damage[id] + " Delay: " + MeleeAttack.delay[id] + " ATK: " + MeleeAttack.atk[id])
      
    }
    
    
  
  
  //Position2d.x[id]=100
    
  }
  
  update(time,dt) {
    try { 
    this.systemManager.update(dt)
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}