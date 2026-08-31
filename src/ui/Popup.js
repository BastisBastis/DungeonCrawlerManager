import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"

import {Window} from "./Window"
import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class Popup extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    string="Polly wants a cracker?",
    config={}
  ) {
    
    const {
      width=800,
      height=340,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      buttonFontColor=fontColor,
      hoverFontColor,
      borderColor=Palette.brown4.hex,
      onConfirm=()=>false,
      onCancel=()=>false,
      confirmString="OK",
      cancelString="Cancel",
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
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:100,
      height:80,
      depth:depth,
      //borderColor:borderColor,
      
      //fontColor:fontColor,
      //hoverBackgroundColor:Palette.brown1.hex,
      //downBackgroundColor:Palette.brown2.hex,
      //downFontColor:fontColor,
    }
      
    this.label=scene.add.text(x,top+height*0.3,string,{
      fontSize:labelFontSize,
      fontFamily:fontFamily,
      color:fontColor,
      wordWrap:{
        width:width*0.9
      },
      align:"center"
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
      
    
    this.cancel=new Button(scene,
      left+width*0.25,top+height*0.7,cancelString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onCancel()
        }
      }
      
    ).setVisible(showCancel)
     
      
      
    const confirmX = showCancel ? left+width*0.75 : x
    
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