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
      width=1200,
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
    this.unitDetailsPosition = {
      x: this.scene.cameras.main.width - 300,
      y: this.scene.cameras.main.height / 2 - 200
    }
    
    
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
       "Back", 
       {
        ...btnConfig,
        onClick : ()=>{
          try { 
          EventCenter.emit("toGameMenu")
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      })
    )
    
    const deltaX = 500
    const startX = x-deltaX/2
    const deltaY = 400
    const startY = y - deltaY/2 - 140
    const unitDetailsPosition = {
      x: this.scene.cameras.main.width - 300,
      y: this.scene.cameras.main.height / 2 - 0
    }

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
    })
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  

  
  destroy() {
   super.destroy()
    this.gameObjects.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    if (this.unitDetails)
      this.unitDetails.destroy()
   
     
    this.gameObjects=[]
  }
  
}