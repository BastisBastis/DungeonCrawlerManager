import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"


import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class DungeonSummaryPopup extends Popup {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    unitData,
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
    
    const top=y-height/2
    const left=x-width/2
    
    
    
    this.confirm=new Button(scene,
      confirmX,top+height*0.7,confirmString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onConfirm()
        }
      }
    )
      
  }
  
  static prompt(scene,x,y,string,config={}) {
    return new Promise((resolve,reject)=>{
      try { 
      const c=new Popup(scene,x,y,string,{
        ...config,
        onCancel:()=>{
          resolve(0)
        },
        onConfirm:()=>{
          resolve(1)
        }
      })
      } catch (er) {console.log(er.message,er.stack); throw er} 
    })
  }
  
  destroy() {
    super.destroy()
    this.label.destroy()
    this.cancel.destroy()
    this.confirm.destroy()
    
    return
    this.scene.tweens.add({
      targets:[this,this.label,this.cancel,this.confirm],
      y:"+=1080",
      duration:300,
      ease:Phaser.Math.Easing.Cubic.In,
      onComplete:()=>{
        super.destroy()
        this.label.destroy()
        this.cancel.destroy()
        this.confirm.destroy()
      }
    })
    this.scene.tweens.add({
      targets:this.bgBlocker,
      alpha:0,
      duration:300
    })
    
    
  }
  
}