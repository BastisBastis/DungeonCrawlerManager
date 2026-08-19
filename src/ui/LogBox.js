import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"


import {Window} from "./Window"

export class LogBox extends Window {

  constructor(scene,x,y,config={}) {
    const {
      fontSize=50,
      width=500,
      height=400,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      cornerRadius=0,
      backgroundColor=0xffffff,
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
      
    /*
    this.label=scene.add.text(x,y,string,{
      fontSize:fontSize,
      fontFamily:fontFamily,
      color:fontColor
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      */
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.fontColor=fontColor
    this.depth = depth
    this.width = width
    this.height = height
    this.margin=margin
    this.scene = scene
    
    this.messages = []
    
    const shape = this.scene.make.graphics();

    shape.fillStyle(0xffffff);
    shape.fillRect(
        this.x-this.width/2,
        this.y-this.height/2,
        this.width,
        this.height
    )

    this.mask = shape.createGeometryMask();



  }
  
  addLine(string) {
    
    var x = this.x - this.width/2+ this.margin;
    var y = this.y + this.height/2 - this.margin
    
    
    
    var label = this.scene.add.text(
      x,
      y,
      string,
      {
        fontSize:this.fontSize,
        fontFamily:this.fontFamily,
        color:this.fontColor,
        align:"left",
        wordWrap: {

          width: this.width-this.margin/2,

          useAdvancedWrap: true

        } 
      }
    ).setOrigin(0,1)
      .setDepth(this.depth)
      .setMask(this.mask)
      
    const labelHeight = label.height
      
    for (const oldLabel of this.messages) {
      oldLabel.y -= labelHeight
    }
      
    this.messages.push(label)
    
  }

  

  destroy() {
    super.destroy()
    //this .label.destroy()
  }

}