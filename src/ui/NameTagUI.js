import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"
import { Palette } from "../data/Palette" 


import {Window} from "./Window"

export class NameTagUI extends Window {

  constructor(scene,x,y,
    name = "Name",
    config={}) {
    
    const {
      fontSize=24,
      width=100,
      height=40,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      cornerRadius=0,
      backgroundColor=Palette.beige2.hex,
      onClick=()=>false,
      margin = 10,
    }=config
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      cornerRadius,
      backgroundColor,
      onClick:onClick,
    })
    
    
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.fontColor=fontColor
    this.depth = depth
    this.width = width
    this.height = height
    this.margin=margin
    this.scene = scene
    
    this.numLabels = 6
    
    var centerX = x
    var leftX = x - width/2 +margin
    var rightX = x+width / 2 -margin
    var deltaY = height / this.numLabels
    var labelY = y - height/2  + deltaY /2
    var fontConfig = {
        fontSize:this.fontSize,
        fontFamily:this.fontFamily,
        color:this.fontColor,
        align:"left",
        wordWrap: {

          width: this.width-this.margin/2,

          useAdvancedWrap: true

        } 
      }
      
    
    
    this.label = this.scene.add.text(
      centerX,
      labelY,
      name,
      {
        ...fontConfig,
        align: "center"
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth)
    
      this.children.push(this.label)
   
  }
  
  

  destroy() {
    
    super.destroy()
    
  }

}