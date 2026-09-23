import Phaser from "phaser"


//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff"
import * as Utils from "../helpers/Utils"
import { Store } from "../helpers/Store"


//Data
import { Palette } from "../data/Palette" 
import { MetaProgressionData } from "../data/MetaProgressionData" 

//UI
 
import { Button } from "./Button"

import { Popup } from "./Popup" 
import { Window } from "./Window"
import { MetaDetails } from "./Popups/MetaDetails" 




export class TreasuryMenu extends Window {
  
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
    
    this.metaDetails = null
    
    
    
    const btnConfig={
      fontSize:32,
      width:100,
      height:80,
      depth:depth,
    }
    
    const labelConfig = {
     fontSize: 32,
     color: Palette.brown4.string,
     fontFamily: GlobalStuff.FontFamily
    }
    this.labelConfig = labelConfig
    
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
    
    
    const startX = x-width/2
    const deltaY = 80
    const startY = y - height/2 + 240
    this.deltaY = deltaY
    this.startY = startY
    
    const columnX = [
     startX + 60,
     startX + 500,
     startX + 740,
     startX + 1020
    ]
    this.columnX = columnX
     
    
    this.gameObjects.push(
     scene.add.text(
      x, 
      y - height/2 + 60,
      "Treasury",
      {
       ...labelConfig,
       fontSize: 64
      }
     ).setDepth(depth)
     .setOrigin(.5,.5)
    )
    
    this.gameObjects.push(
     scene.add.text(
      x, 
      y - height/2 + 120,
      "Permanent unlockables and upgrades",
      {
       ...labelConfig,
       fontSize: 32
      }
     ).setDepth(depth)
     .setOrigin(.5,.5)
    )

    this.gemsLabel =
     scene.add.text(
      x + width/2 - 120, 
      y - height/2 + 200,
      "Gems: " + Store.meta.gems,
      {
       ...labelConfig,
       fontSize: 48
      }
     ).setDepth(depth)
     .setOrigin(.5,.5)
    

    this.gameObjects.push(this.gemsLabel);
    
    ["Item", "Cost", "Owned"].forEach((string, i)=>{
     const originX = [0,.5,.5][i]
     this.gameObjects.push(
      scene.add.text(
       columnX[i], 
       startY,
       string,
       {
        ...labelConfig,
        fontSize: 40
       }
      ).setDepth(depth)
      .setOrigin(originX,.5)
     )
    })
    
    this.itemObjects = []
    
    this.reloadItems()
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  showDetails(item) {
   try { 
   this.hideDetails()
   this.metaDetails = new MetaDetails(
    this.scene,
    this.x + this.width/2 - 220,
    this.y,
    item.name,
    item.description ,{
     depth: this.depth+100
    }
   )
   } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  hideDetails() {
   console.log(this.metaDetails)
   if (this.metaDetails && this.metaDetails.destroy) {
    try { 
    this.metaDetails.destroy()
    } catch (er) {console.log(er.message,er.stack); throw er} 
    
   }
   this.metaDetails = []
  }
  
  reloadItems() {
   
   this.itemObjects.forEach(item=>{
    item.destroy()
   })
   
   Object.entries(MetaProgressionData).forEach(([key, progressionData], i)=>{
    //console.log(this.columnX)
     
     const label =
      this.scene.add.text(
       this.columnX[0], 
       this.startY + this.deltaY*(i+1),
       progressionData.name,
       {
        ...this.labelConfig,
        fontSize: 32
       }
      ).setDepth(this.depth)
      .setOrigin(0,.5)
      label
      .setInteractive(
         new Phaser.Geom.Rectangle(
          0,
          0,
          label.width,
          label.height
         ),
         Phaser.Geom.Rectangle.Contains
         )
        .on("pointerover", ()=>{
         try { 
         this.showDetails(progressionData)
         } catch (er) {console.log(er.message,er.stack); throw er} 
         })
        .on("pointerout", ()=>{
         try { 
         this.hideDetails()
         } catch (er) {console.log(er.message,er.stack); throw er} 
         })
      
      
      
      this.itemObjects.push(label)
      
      const level = Store.meta.progression[key]
      if (level < progressionData.levelCosts.length) {
       const cost = progressionData.levelCosts[level]
       
       this.itemObjects.push(
        this.scene.add.text(
         this.columnX[1], 
         this.startY + this.deltaY*(i+1),
         cost,
         {
          ...this.labelConfig,
          fontSize: 32
         }
        ).setDepth(this.depth)
        .setOrigin(.5,.5)
       )
      }
      
      if (level > 0) {
       
       this.itemObjects.push(
        this.scene.add.text(
         this.columnX[2], 
         this.startY + this.deltaY*(i+1),
         progressionData.levelCosts.length==1?"YES":level,
         {
          ...this.labelConfig,
          fontSize: 32
         }
        ).setDepth(this.depth)
        .setOrigin(.5,.5)
       )
      }
      
      if (level < progressionData.levelCosts.length) {
       const cost = progressionData.levelCosts[level]
       
       this.itemObjects.push(
        new Button(
         this.scene,
         this.columnX[3],
         this.startY + this.deltaY * (i+1),
         "BUY",
         {
          fontFamily: GlobalStuff.FontFamily,
          fontSize: 32,
          width: 100,
          height: 60,
          depth: this.depth,
          onClick: async ()=>{
           if (Store.meta.gems < cost) {
            await Popup.prompt(this.scene,this.scene.cameras.main.width/2,this.scene.cameras.main.height/2,"Not enough gems!", {depth:this.depth + 100})
            
            return
           }
           Store.meta.progression[key]++
           Store.meta.gems-=cost
           this.gemsLabel.text = "Gems: "+Store.meta.gems
           this.reloadItems()
          }
         }
        )
       )
       
      }
      
     
    })
  }
  
  destroy() {
   super.destroy()
    this.gameObjects.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    
    this.itemObjects.forEach(o=>o.destroy())
     
     
    if (this.metaDetails && this.metaDetails.destroy) this.metaDetails.destroy()
    
    this.gameObjects=[]
  }
  
}