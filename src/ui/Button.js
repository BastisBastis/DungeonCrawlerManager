import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"
import { EventCenter } from "../helpers/EventCenter" 

import {Window} from "./Window"

export class Button extends Window {

  constructor(scene,x,y,string,config={}) {
    const {
      fontSize=70,
      width=300,
      height=150,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      hoverFontColor=fontColor,
      downFontColor=fontColor,
      cornerRadius=8,
      backgroundColor=0xffffff,
      hoverBackgroundColor=0x698d6e,
      downBackgroundColor=0x00ff00,
      onClick=()=>false,
      requireDown=true
    }=config
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      cornerRadius,
      backgroundColor,
      onClick:undefined,
    })
      
    this.label=scene.add.text(x,y,string,{
      fontSize:fontSize,
      fontFamily:fontFamily,
      color:fontColor
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
    this.down=false
    this.backgroundColor=backgroundColor
    this.hoverBackgroundColor=hoverBackgroundColor
    this.backgroundColor=backgroundColor
    this.downFontColor=downFontColor
    this.fontColor=fontColor
    this.onClick=onClick
      
    this.bg.on('pointerover', () => {
      if (this.down)
        return
      this.bg.setFillStyle(hoverBackgroundColor,1)
          

      this.label.setColor(hoverFontColor)
      EventCenter.emit("playAudio",{key:"hover"})
        })
      .on('pointerout', () => {
          this.deselect()
        })
      .on('pointerdown', () => {
          this.select()
        })
      .on('pointerup', () => {
        this.bg.setFillStyle(backgroundColor)
        EventCenter.emit("playAudio",{key:"click"})
          
        this.label.setColor(fontColor)
        
        if (this.down) {
          
          this.down=false
          onClick()
        }
        
          //this.scene.start("game")
          //EventCenter.emit("playAudio",{key:"hover"})
        })
        
        this.children.push(this.label)
  }

  click(){
    this.onClick()
    this.deselect()
  }

  select() {
    this.bg.setFillStyle(this.downBackgroundColor,1)
      this.down=true

      this.label.setColor(this.downFontColor)
      EventCenter.emit("playAudio",{key:"hover"})
  }
  
  deselect() {
    this.bg.setFillStyle(this.backgroundColor)
    this.down=false

    this.label.setColor(this.fontColor)
  }

  setText(val) {
    this.label.text=val
  }

  setVisible(val) {
    super.setVisible(val)
    this.label.visible=val
    return this
  }

  destroy() {
    super.destroy()
    this.label.destroy()
  }

}