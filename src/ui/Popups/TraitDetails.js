import Phaser from "phaser"
import { GlobalStuff } from "../../helpers/GlobalStuff"
import { Palette } from "../../data/Palette" 

import { TraitList } from "../../data/Traits" 
import { Window } from "../Window"

export class TraitDetails extends Window {

  constructor(scene,x,y,
    traitIndex,
    config={}) {
    
    const {
      fontSize=28,
      width=400,
      height=300,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      cornerRadius=0,
      backgroundColor=Palette.beige2.hex,
      borderThickness=1,
      onClick=()=>false,
      onHover=()=>false,
      onStopHover=()=>false,
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
      onHover:onHover
    })
    
    
    
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.fontColor=fontColor
    this.depth = depth
    this.width = width
    this.height = height
    this.margin=margin
    this.scene = scene
    

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
      
      //console.log(TraitList, traitIndex)
    
        
    this.children.push(this.scene.add.text(
      x,
      y - height/2 + 60,
      TraitList[traitIndex].name,
      {
        ...fontConfig,
        wordWrap: undefined
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth))
  
        
    this.children.push(this.scene.add.text(
      x,
      y - height/2 + 120,
      TraitList[traitIndex].description,
      {
        ...fontConfig,
        align: "center"
   
      }
    ).setOrigin(.5,0)
      .setDepth(this.depth))
    
  }


  
  destroy() {
    
    super.destroy()
    for (const child of this.children)
      child.destroy()
  }


}