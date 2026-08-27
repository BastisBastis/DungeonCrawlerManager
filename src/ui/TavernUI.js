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
    
    this.unitDetails = null
    this.unitDetailsPosition = {
      x: this.scene.cameras.main.width - 300,
      y: this.scene.cameras.main.height / 2 - 200
    }
    
    this.createPartyOverview()
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
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }

  createPartyOverview() {
    this.partyOverviewCards = []
    
    Store.party.forEach(unitIndex=>{
      const unitData = Store.units[unitIndex]
      const card = new UnitOverview(this.scene, 0, 0, unitData)
      this.partyOverviewCards.push(card)
    })

    this.layoutPartyOverviewCards()

  }

  layoutPartyOverviewCards() {
    const y = 200
    const numCols = 4
    const startX = 100
    const deltaX = 200
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
    let i = 0
    
    Store.recruitmentPool.forEach(unitData=>{
      const card = new UnitOverview(
        this.scene, 
        startX + deltaX * (i % numCols), 
        startY + deltaY * Math.floor(i / numCols), 
        unitData,
        {
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
      i++
    })
  
  }

  
  destroy() {
    this.gameObjects.forEach(object=>object.destroy())
    this.gameObjects=[]
  }
  
}