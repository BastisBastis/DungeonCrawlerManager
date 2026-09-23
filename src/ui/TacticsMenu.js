import Phaser from "phaser"


//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"
import { Store } from "../helpers/Store"
import { getDungeonSummary , getAllDungeonLogs, getTotalDungeonStatSummary} from "../systems/StatSystem" 

//Data
import { Palette } from "../data/Palette" 
import { UnitNames } from "../data/UnitNames" 
import { TraitList } from "../data/Traits" 

//Components 
import { Tactics } from "../components/Tactics" 

//UI
 
import { Button } from "./Button"
import { UnitDetails } from "./Tavern/UnitDetails"
import { Popup } from "./Popup" 
import { Window } from "./Window"
import { MenuUnitCard } from "./MenuUnitCard"
import { UnitOverview } from "./Tavern/UnitOverview"



export class TacticsMenu extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    config={}
  ) {
    
    const {
      width=1400,
      height=1040,
      depth=100,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      buttonFontColor=fontColor,
      hoverFontColor,
      borderColor=Palette.brown4.hex,
      onConfirm=()=>false,
      blockBackground=true,
      backgroundColor = Palette.beige2.hex,
      world,
      onBack = ()=>{return},
      backButtonString = "Back"
    }=config
    

   
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      backgroundColor,
      blockBackground:blockBackground,
      blockerTweenDuration:300,
      blockAlpha:0.2,
      borderColor
    })
  
    try { 
    //Background
    this.scene=scene
    
    
    this.gameObjects = []
    
    
    this.unitDetails = null
    
    this.world = world
    
    
    const btnConfig={
      fontSize:32,
      width:100,
      height:80,
      depth:depth,
    }
    
    this.gameObjects.push(
      new Button(
       this.scene, 
       x,
       y-height/2+height*0.9,
       backButtonString, 
       {
        ...btnConfig,
        width: 140,
        onClick : ()=>{
          try { 
          onBack()
          EventCenter.emit("toGameMenu")
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      })
    )
    
    const deltaX = 660
    const startX = x-deltaX/2
    const deltaY = 400
    const startY = y - deltaY/2 - 140
    const unitDetailsPosition = {
      x: this.scene.cameras.main.width - 160,
      y: this.scene.cameras.main.height / 2 - 0
    }

    this.unitButtons = []
    Store.run.party.forEach((unitIndex, i)=>{
      const unit = Store.run.units[unitIndex]
      const card = new UnitOverview(
        scene,
        startX + deltaX * (i % 2),
        startY + deltaY * Math.floor(i/2),
        unit,
        {
          depth:depth,
          showCost:false,
          onHover:()=>{
            this.unitDetails = new UnitDetails(
              scene,
              unitDetailsPosition.x,
              unitDetailsPosition.y,
              unit,
              {
                depth:depth,
              }
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
      this.gameObjects.push(card)

      this.unitButtons.push(this.createUnitButtons(i, unitIndex, startX + deltaX * (i % 2), startY + deltaY * Math.floor(i/2) + 180))

    })

    
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  createUnitButtons(index, unitIndex, x, y) {
    const buttons = []
    const selectedColor = Palette.blue1.string
    const deselectedColor = Palette.grey5.string
    const btnConfig={
      fontSize:24,
      width:160,
      height:100,
      depth:this.depth+2,
      fontColor: deselectedColor,
      backgroundColor: Palette.beige2.hex,
      borderThickness: 0
    }
    

    const deltaX = 200

    const btnData = [
      [
        "Defensive\nless damage,\nmore defense\nless threat",
        ()=>{
          this.setTactic(unitIndex, 0)
        }
      ],
      [
        " \nNeutral\n ",
        ()=>{
          this.setTactic(unitIndex, 1)
        }
      ],
      
      [
        "Offensive\nmore damage,\nless defense\nmore threat",
        ()=>{
          this.setTactic(unitIndex, 2)
        }
      ]
    ]

    btnData.forEach((data, i)=>{
      const string = data[0]
      const callback = data[1]
      const button = new Button(
        this.scene,
        x - deltaX + deltaX*i,
        y,
        string,
        {
          ...btnConfig,
          onClick:()=> {
           try { 
           
            this.setTactic(unitIndex, i)
            
            
            
            } catch (er) {console.log(er.message,er.stack); throw er} 
            buttons.forEach(btn=>{
              btn.label.setColor(deselectedColor)
              btn.fontColor = deselectedColor
            })
            button.label.setColor(selectedColor)
            button.fontColor = selectedColor
          }
        }
      )
      if (i == Store.run.tactics[unitIndex]) {
        button.label.setColor(selectedColor)
        button.fontColor = selectedColor
      }
      buttons.push(button)
    })
    return buttons
  }

  setTactic(unitIndex, tacticIndex) {
   
   if (this.world) {
    
    Tactics.index[Store.run.units[unitIndex].id] = tacticIndex
   }
   
    Store.run.tactics[unitIndex] = tacticIndex
  }
  
  destroy() {
   super.destroy()
    this.gameObjects.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    if (this.unitDetails)
      this.unitDetails.destroy()
   
    this.unitButtons.forEach(collection=>{
      collection.forEach(button=>{
        button.destroy()
      })
    })
     
    this.gameObjects=[]
  }
  
}