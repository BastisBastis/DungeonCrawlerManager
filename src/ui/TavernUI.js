import Phaser from "phaser"
import {
  createWorld,
  deleteWorld,
  addEntity,
  addComponent
} from "bitecs"

//factories




//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"
import { Store } from "../helpers/Store"

//Data
import { Palette } from "../data/Palette" 
import { UnitNames } from "../data/UnitNames" 

//UI
import { UnitOverview } from "./Tavern/UnitOverview"
import { MenuUnitCard } from "./MenuUnitCard" 
import { Button } from "./Button"
import { UnitDetails } from "./Tavern/UnitDetails"

//Temp
import { UnitClass } from "../components/ClassType"






export class TavernUI {
  
  constructor(scene) {
  
  
    try { 
    //Background
    this.scene=scene
    
    this.gameObjects = []
    this.partyOverviewCards = []
    
    this.unitDetails = null
    this.unitDetailsPosition = {
      x: this.scene.cameras.main.width - 300,
      y: this.scene.cameras.main.height / 2 - 200
    }
    
    this.reloadPartyOverview()
    this.createRecruitmentOverview()
    
    const backBtnX = this.scene.cameras.main.width - 300
    const backBtnY = this.scene.cameras.main.height - 150

    this.gameObjects.push(
      new Button(this.scene, backBtnX, backBtnY, "Back", {
        fontSize:48,
        width: 400,
        onClick : ()=>{
          EventCenter.emit("toGameMenu")
        }
      })
    )
    
    this.goldLabel = this.scene.add.text(
      this.scene.cameras.main.width-40, 40, "GOLD: " + Store.run.gold, { fontSize: 80 })
    .setOrigin(1,0)
    
    this.gameObjects.push(this.goldLabel)
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  reloadPartyOverview() {
    this.partyOverviewCards.forEach(card=>{
      card.destroy()
    })
    this.partyOverviewCards = []
    
    var i = 0 
    
    
    Store.run.party.forEach(unitIndex=>{
      const index = i
      const unitData = Store.run.units[unitIndex]
      const card = new UnitOverview(
        this.scene, 0, 0, 
        unitData,
        
        {
          showCost : false,
          buttonText: "Dismiss",
          buttonCallback: ()=>{
            
            if (Store.run.party.length <= 1) {
              console.log("Need at least one party member")
              return
            }
            
            Store.run.party.splice(index, 1)
            this.reloadPartyOverview()
          },
          onHover:()=>{
            this.unitDetails = new UnitDetails(
              this.scene,
              this.unitDetailsPosition.x,
              this.unitDetailsPosition.y,
              unitData
            )
          },
          onStopHover:()=>{
            if (this.unitDetails) {
              this.unitDetails.destroy()
              this.unitDetails = null
            }
          }
          
        }
      )
      this.partyOverviewCards.push(card)
      this.gameObjects.push(card)
      i++
    })

    this.layoutPartyOverviewCards()

  }

  layoutPartyOverviewCards() {
    const y = 200
    const numCols = 4
    const startX = 140
    const deltaX = 300
    let i = 0

    this.partyOverviewCards.forEach(card=>{
      card.x = startX + deltaX * i
      card.y = y
      i++
    })
  }

  createRecruitmentOverview() {
    this.recruitmentOverviewCards = []
    const startY = this.scene.cameras.main.height - 400
    const numCols = 4
    const numRows = 2
    const startX = 140
    const deltaX = 300
    const deltaY = 240
    var i = 0
    
    Store.menu.recruitmentPool.forEach(unitData=>{
      const index = i
      const card = new UnitOverview(
        this.scene, 
        startX + deltaX * (i % numCols), 
        startY + deltaY * Math.floor(i / numCols), 
        unitData,
        {
          buttonText: "Hire",
          buttonCallback: ()=>{
            
            if (Store.run.party.length >= 4) {
              console.log("Party is full")
              return
            }
            if (card.unitData.recruitmentCost > Store.run.gold) {
              console.log("Not enough gold!")
              return
            }
            
            Store.run.gold -=card.unitData.recruitmentCost
            
            Store.run.units.push(card.unitData)
            
            Store.run.party.push(Store.run.units.length-1)
            unitData.unitIndex = Store.run.units.length-1
            
            this.reloadPartyOverview()
            this.recruitmentOverviewCards.splice(index, 1)
            Store.menu.recruitmentPool.splice(index,1)
            card.destroy()
            
            this.goldLabel.text = "GOLD: " + Store.run.gold
          },
          onHover:()=>{
            this.unitDetails = new UnitDetails(
              this.scene,
              this.unitDetailsPosition.x,
              this.unitDetailsPosition.y,
              unitData
            )
          },
          onStopHover:()=>{
            if (this.unitDetails) {
              this.unitDetails.destroy()
              this.unitDetails = null
            }
          }
        }
      )
      this.recruitmentOverviewCards.push(card)
      this.gameObjects.push(card)
      i++
    })
  
  }

  
  destroy() {
    this.gameObjects.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    if (this.unitDetails)
      this.unitDetails.destroy()
    this.gameObjects=[]
  }
  
}