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
import { UnitNames } from "../data/UnitNames" 

//UI
import { DungeonUnitCard } from "../ui/DungeonUnitCard"
import { MenuUnitCard } from "../ui/MenuUnitCard" 
import { Button } from "../ui/Button"

//Temp
import { UnitClass } from "../components/ClassType"






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
    
    this.messageLabel = this.add.text(300, this.cameras.main.height - 100, "", { fontSize: 100 })
    
    if (result.winner != -1) {
        this.messageLabel.setText(result.winner == 0 ? "You won!" : "You died!")
     }

    this.setupTeamPickingUI()

    const button = new Button(this, 380, 700, "Enter Dungeon", {
      fontSize:48,
      width: 400,
      onClick : ()=>{this.startDungeon()
      }
    })
    //this.add.text(380, 700, "Start Dungeon", { fontSize: 100, backgroundColor: "#666", padding: { x: 10, y: 5 } }).setInteractive().on("pointerdown", this.startDungeon, this)
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  setupTeamPickingUI() {
    
    this.selectedUnits = []
    this.unitCards = []
    
    var nameIndices = []
    for (let i = 0; i < UnitNames.length; i++) {
      nameIndices.push(i)
    }
    
    Utils.shuffleArray(nameIndices)

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
          dmgMin : 6,
          dmgMax : 10,
          delayMin : 15,
          delayMax : 20,
          atkMin : 6,
          atkMax : 10,
          threatMods: {
            attackMin: 51.4,
            attackMax: 52.0,
            proximityMin: 1.0,
            proximityMax: 1.0,
            healMin: 1.0,
            healMax: 1.0,
            otherMin: 1.0,
            otherMax: 1.0
          },
          healer: false
        }
      classValues[UnitClass.CLERIC] = {
          hpMin : 40,
          hpMax : 70,
          acMin : 7,
          acMax : 10,
          dmgMin : 4,
          dmgMax : 8,
          delayMin : 11,
          delayMax : 16,
          atkMin : 5,
          atkMax : 9,
          healer: true,
          healAmount: 60,
          healDelay : 50,
          threatMods: {
            attackMin: 1.0,
            attackMax: 1.0,
            proximityMin: 1.0,
            proximityMax: 1.0,
            healMin: 1.0,
            healMax: 1.0,
            otherMin: 1.0,
            otherMax: 1.0
          },
        }
        classValues[UnitClass.ROGUE] = {
          hpMin : 70,
          hpMax : 110,
          acMin : 7,
          acMax : 10,
          dmgMin : 10,
          dmgMax : 14,
          delayMin : 12,
          delayMax : 16,
          atkMin : 10,
          atkMax : 16,
          healer: false,
          threatMods: {
            attackMin: 1.0,
            attackMax: 1.0,
            proximityMin: 1.0,
            proximityMax: 1.0,
            healMin: 1.0,
            healMax: 1.0,
            otherMin: 1.0,
            otherMax: 1.0
          },
        }
      

      var hp = Utils.getRandomBellInt(classValues[classType].hpMin, classValues[classType].hpMax, 3)
      var ac = Utils.getRandomBellInt(classValues[classType].acMin,classValues[classType].acMax,3)
      var damage = Utils.getRandomBellInt(classValues[classType].dmgMin,classValues[classType].dmgMax,3)
      var delay = Utils.getRandomBellInt(classValues[classType].delayMin,classValues[classType].delayMax, 3)
      var atk = Utils.getRandomBellInt(classValues[classType].atkMin,classValues[classType].atkMax, 3)
      
      var threatMods = {
        attack: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.attackMin, classValues[classType].threatMods.attackMax)*100)/100,
        proximity: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.proximityMin, classValues[classType].threatMods.proximityMax)*100)/100,
        heal: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.healMin, classValues[classType].threatMods.healMax)*100)/100,
        other: Math.floor(Phaser.Math.FloatBetween(classValues[classType].threatMods.otherMin, classValues[classType].threatMods.otherMax)*100)/100,
      }
      
      var nameIndex = nameIndices.pop()
     var name = UnitNames[nameIndex]

      let healer =false
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
          classType,
          name,
          nameIndex,
          threatMods,
          healer
        }
       

      var duc = new MenuUnitCard(
        this,
        camWidth / 4 * (i % 4 + 0.5),
        140 + Math.floor(i/4) * 280,
        unitData,
        {
          depth: 10,
          onClick: ()=>{this.toggleUnitCard(i)}
        }
      )
      
      this.unitCards.push({
        data: unitData,
        card: duc
      })

    }

  }
  
  toggleUnitCard(index) {
    try { 
    this.unitCards[index].card.toggleSelected()
    var selected = this.unitCards[index].card.selected
    
    if (!selected) {
      this.selectedUnits = this.selectedUnits.filter(item=>(item !=index))
    } else {
      if (this.selectedUnits.length >= 4) 
        this.toggleUnitCard(this.selectedUnits[0])
      this.selectedUnits.push(index)
    }
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  startDungeon() {
    
    
    if (this.selectedUnits.length <1) {
      this.messageLabel.text = "Select at least one hero!"
      return
    }
    
    const heroData = []
    for (const index of this.selectedUnits) {
      heroData.push(this.unitCards[index].data)
    }
    
    //var heroData = this.tempHeroData()
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