import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"


import {Window} from "./Window"

export class DungeonUnitCard extends Window {

  constructor(scene,x,y,
    unitData = {},
    config={}) {
    const {
      name = "UnitName",
      level = 1,
      id = 0,
      classType = "Warrior",
      hitpoints = 100,
      target = ""
    } = unitData
    const {
      fontSize=32,
      width=300,
      height=240,
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
    
    
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.fontColor=fontColor
    this.depth = depth
    this.width = width
    this.height = height
    this.margin=margin
    this.scene = scene
    
    this.numLabels = 5
    
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
    
    this.nameLabel = this.scene.add.text(
      centerX,
      labelY,
      name,
      {
        ...fontConfig,
        align: "center"
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth)
      
    this.classLabel = this.scene.add.text(
      centerX,
      labelY + deltaY * 1,
      classType,
      {
        ...fontConfig,
        align: "center"
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth)
      
    this.levelNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * 2,
      "Level:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    this.levelValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * 2,
      level,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
      
    this.hpNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * 3,
      "HP:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    this.hpValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * 3,
      hitpoints+"/"+hitpoints,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
      
      this.targetNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * 4,
      "Target:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    this.targetValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * 4,
      target,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
      
    this.labels = [
      this.nameLabel,
      this.classLabel,
      this.levelNameLabel,
      this.levelValueLabel,
      this.hpNameLabel,
      this.hpValueLabel,
      this.targetNameLabel,
      this.targetValueLabel
    ]

  }
  
  layout() {
    var x = this.x
    var y = this.y
    var width = this.width
    var height = this.height
    var margin = this.margin
    var centerX = x
    var leftX = x - width/2 +margin
    var rightX = x+width / 2 -margin
    var deltaY = height / this.numLabels
    var labelY = y - height/2  + deltaY /2
    
    this.nameLabel.x = centerX
    this.nameLabel.y = labelY
    this.classLabel.x = centerX
    this.classLabel.y = labelY+deltaY
    this.levelNameLabel.x = leftX
    this.levelNameLabel.y = labelY+deltaY*2
    this.levelValueLabel.x = rightX
    this.levelValueLabel.y = labelY+deltaY*2
    this.hpNameLabel.x = leftX
    this.hpNameLabel.y = labelY+deltaY*3
    this.hpValueLabel.x = rightX
    this.hpValueLabel.y = labelY+deltaY*3
    this.targetNameLabel.x = leftX
    this.targetNameLabel.y = labelY+deltaY*4
    this.targetValueLabel.x = rightX
    this.targetValueLabel.y = labelY+deltaY*4
    
  }
  

  destroy() {
    
    super.destroy()
    for (const label of this.labels)
      label.destroy()
  }

}