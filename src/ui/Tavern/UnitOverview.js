import Phaser from "phaser"
import { GlobalStuff } from "../../helpers/GlobalStuff"


import { Window } from "../Window"

export class UnitOverview extends Window {

  constructor(scene,x,y,
    unitData = {},
    config={}) {
    const {
      name = "UnitName",
      level = 1,
      id = 0,
      classType = "Warrior",
      hitpoints = 100,
      target = "",
      armorClass = 10,
      damage = 10,
      delay = 10,
      threatMod = undefined,
      recruitmentCost = 0

    } = unitData
    const {
      fontSize=22,
      width=200,
      height=200,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      cornerRadius=0,
      backgroundColor=0xffffff,
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
    this.selected = false
    this.unitData = unitData
    this.numLabels = 3
    
    var centerX = x
    var leftX = x - width/2 +margin
    var rightX = x+width / 2 -margin
    var deltaY = 32
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
      
    var rowIndex = 0
    
    this.children.push(this.scene.add.text(
      centerX,
      labelY,
      name,
      {
        ...fontConfig,
        align: "center"
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth))
      
    rowIndex++
      
    this.children.push(this.scene.add.text(
      centerX,
      labelY + deltaY * rowIndex,
      classType,
      {
        ...fontConfig,
        align: "center"
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth))
      
      rowIndex++
      
    this.children.push(this.scene.add.text(
      leftX,
      labelY + deltaY * rowIndex,
      "Level:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth))
    
    
    this.children.push(this.scene.add.text(
      rightX,
      labelY + deltaY * rowIndex,
      level,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth))
    
    rowIndex++
    
    this.children.push(this.scene.add.text(
      leftX,
      labelY + deltaY * rowIndex,
      "Cost:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth))
    
    
    this.children.push(this.scene.add.text(
      rightX,
      labelY + deltaY * rowIndex,
      recruitmentCost,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth))
    
    rowIndex++

    this.bg.on('pointerover', () => {
      onHover()
    })
    .on('pointerout', () => {
      onStopHover()
    })
  }
  
  

  destroy() {
    
    super.destroy()
    for (const label of this.labels)
      label.destroy()
  }

}