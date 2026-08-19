import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories




//helpers

import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"

//Data
import { Palette } from "../data/Palette" 

//UI
import { DungeonUnitCard } from "../ui/DungeonUnitCard"
import { Button } from "../ui/Button"

//Temp
import { UnitClass } from "../components/ClassType"



const unitNames = [
  "Bobby",
  "Robert",
  "Lars",
  "Seamus",
  "Arnold",
  "Larry",
  "Johnny",
  "Ricky"
]


export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
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
    
    if (GlobalStuff.verboseConsole > 1)
      console.log("Game Start", result)
      
      
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    if (result.winner != -1) {
        this.add.text(300, this.cameras.main.height - 100, result.winner == 0 ? "You won!" : "You died!", { fontSize: 100 })
    }

    this.setupTeamPickingUI()

    const button = new Button(this, 380, 700, "Start Dungeon", {
      onClick : ()=>{this.startDungeon()}
    })
    //this.add.text(380, 700, "Start Dungeon", { fontSize: 100, backgroundColor: "#666", padding: { x: 10, y: 5 } }).setInteractive().on("pointerdown", this.startDungeon, this)
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  setupTeamPickingUI() {
    
    this.pickedUnits = []
    this.unitCards = []

    for (let i = 0; i < 8; i++) {
      const classType = [
        UnitClass.WARRIOR,
        UnitClass.CLERIC,
        UnitClass.ROGUE
      ][Utils.getRandomInt(0,3)]
      
      const classValues = {}
      classValues[UnitClass.WARRIOR] = {
          hpMin : 100,
          hpMax : 150,
          acMin : 12,
          acMax : 20,
          dmgMin : 8,
          dmgMax : 12,
          delayMin : 15,
          delayMax : 20,
          atkMin : 10,
          atkMax : 14,
          healer: false
        }
      classValues[UnitClass.CLERIC] = {
          hpMin : 40,
          hpMax : 70,
          acMin : 7,
          acMax : 10,
          dmgMin : 4,
          dmgMax : 8,
          delayMin : 15,
          delayMax : 20,
          atkMin : 5,
          atkMax : 9,
          healer: true,
          healAmount: 60,
          healDelay : 50
        }
        classValues[UnitClass.ROGUE] = {
          hpMin : 70,
          hpMax : 110,
          acMin : 7,
          acMax : 10,
          dmgMin : 15,
          dmgMax : 20,
          delayMin : 10,
          delayMax : 15,
          atkMin : 14,
          atkMax : 20,
          healer: false
        }
      

      var hp = Utils.getRandomBellInt(classValues[classType].hpMin, classValues[classType].hpMax, 3)
      var ac = Utils.getRandomBellInt(classValues[classType].acMin,classValues[classType].acMax,3)
      var damage = Utils.getRandomBellInt(classValues[classType].dmgMin,classValues[classType].dmgMax,3)
      var delay = Utils.getRandomBellInt(classValues[classType].delayMin,classValues[classType].delayMax, 3)
      var atk = Utils.getRandomBellInt(classValues[classType].atkMin,classValues[classType].atkMax, 3)
      var name = unitNames[Utils.getRandomInt(0,unitNames.length)]

      var healer
      if (classValues[classType].healer) {
        healer = {
          amount:classValues[classType].healAmount,
          delay: classValues[classType].healDelay
        }
      }

      const camWidth = this.cameras.main.width
      const camHeight = this.cameras.main.height

      const unitData = {
          hitpoints : hp,
          armorClass : ac,
          damage,
          delay,
          atk,
          name,
          classType
        }

      var duc = new DungeonUnitCard(
        this,
        camWidth / 4 * (i % 4 + 0.5),
        130 + Math.floor(i/4) * 260,
        unitData,
        {
          depth: 10
        }
      )

    }

  }
  
  startDungeon() {
    
    var heroData = this.tempHeroData()
    this.scene.start("dungeon", {
      heroData
    })
  }
  
  tempHeroData() {
    
    var heroData = []
    
    var numHeroes = 2
    
    for (let i = 0; i < numHeroes; i++) {
      
      var hp = Utils.getRandomBellInt(100, 300, 3)
      var ac = Utils.getRandomBellInt(8,15,3)
      var damage = Utils.getRandomBellInt(8,15,3)
      var delay = Utils.getRandomBellInt(15,24, 3)
      var atk = Utils.getRandomBellInt(8,15, 3)
      var name = unitNames[Utils.getRandomInt(0,unitNames.length)]
      
      var healer
      if (i == 1) {
        healer = {
          amount:100,
          delay: 50
        }
      }
      
      heroData.push( {
        hitpoints: hp,
        armorClass: ac,
        damage,
        delay,
        atk,
        healer,
        name
      })
    }
    
    return heroData
    
    
  }
    
  
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}