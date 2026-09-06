import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"
import { Window } from "./Window"

import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class DungeonSummaryPopup extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    summary,
    config={}
  ) {
    
    const {
      width=1200,
      height=740,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      buttonFontColor=fontColor,
      hoverFontColor,
      borderColor=Palette.brown4.hex,
      onConfirm=()=>false,
      onCancel=()=>false,
      confirmString="OK",
      cancelString="",
      showCancel = false,
      buttonFontSize=32,
      labelFontSize=40,
      blockBackground=true,
      backgroundColor = Palette.beige2.hex
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
    console.log(summary)
    this.summary = summary
    
    const top=y-height/2
    const left=x-width/2
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:100,
      height:80,
      depth:depth,
    }
    
    this.children.push(new Button(scene,
      x,top+height*0.9,confirmString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onConfirm()
        }
      }
    ))
    
    this.setupFightTabButtons()


  }

  setupFightTabButtons() {
    const buttonStrings = ["TOTAL"]
    for (let i = 0; i < this.summary.fightSummaries.length; i++) 
      buttonStrings.push("FIGHT " + (i+1))

    const deltaX = this.width/buttonStrings.length
    const y = this.y-this.height/2 + 50

    const selectedColor = "#00FF00"
    const deselectedColor = "#ff0000"
    const btnConfig={
      fontSize:40,
      width:200,
      height:80,
      depth:this.depth+1,
      fontColor: deselectedColor,
      backgroundColor: Palette.beige2.hex,
      borderThickness: 0
    }
    

    this.fightTabButtons = []


    buttonStrings.forEach((string, i) => {
      console.log("Making button")
      const button = new Button(
        this.scene,
        this.x - this.width/2 + (i+.5) * deltaX,
        y,
        string,
        {
          ...btnConfig,
          onClick:()=> {
            this.setFightIndex(i)
            this.fightTabButtons.forEach(btn=>{
              btn.label.setColor(deselectedColor)
              btn.fontColor = deselectedColor
            })
            button.label.setColor(selectedColor)
            button.fontColor = selectedColor
          }
        }
      )
      
      this.fightTabButtons.push(button)
      this.children.push(button)
      if (i == 0) {
        button.label.setColor(selectedColor)
        button.fontColor = selectedColor
      }

    })

  }

  setFightIndex(index) {
    console.log("setFightIndex " + index)
  }
  
  static prompt(scene,x,y,summary,config={}) {
    return new Promise((resolve,reject)=>{
      try { 
      console.log(x, y, summary, config)
      const c=new DungeonSummaryPopup(scene,x,y,summary,{
        ...config,

        onConfirm:()=>{
          resolve(1)
        }
      })
      } catch (er) {console.log(er.message,er.stack); throw er} 
    })
  }
  
  destroy() {
    super.destroy()
    this.children.forEach(child=>child.destroy())
  }
  
}