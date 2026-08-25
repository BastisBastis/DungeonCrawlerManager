import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"


import {Window} from "./Window"

export class MenuUnitCard extends Window {

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
      delay = 10
    } = unitData
    const {
      fontSize=22,
      width=320,
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
    this.selected = false
    
    this.numLabels = 7
    
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
      
    this.labels=[]
    var rowIndex = 0
    
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
      
    rowIndex++
      
    this.classLabel = this.scene.add.text(
      centerX,
      labelY + deltaY * rowIndex,
      classType,
      {
        ...fontConfig,
        align: "center"
      }
    ).setOrigin(.5,.5)
      .setDepth(this.depth)
      
      rowIndex++
      
    this.levelNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * rowIndex,
      "Level:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    
    this.levelValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * rowIndex,
      level,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
    
    rowIndex++
      
    this.hpNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * rowIndex,
      "HP:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    this.hpValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * rowIndex,
      hitpoints,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
      
      rowIndex++
      
    this.acNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * rowIndex,
      "Armor Class:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    this.acValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * rowIndex,
      armorClass,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
      
    rowIndex++
      
    this.damageDelayNameLabel = this.scene.add.text(
      leftX,
      labelY + deltaY * rowIndex,
      "Attack Damage/Delay:",
      {
        ...fontConfig,
        align: "left"
      }
    ).setOrigin(0,.5)
      .setDepth(this.depth)
    
    this.damageDelayValueLabel = this.scene.add.text(
      rightX,
      labelY + deltaY * rowIndex,
      damage+"/"+delay,
      {
        ...fontConfig,
        align: "right"
      }
    ).setOrigin(1,.5)
      .setDepth(this.depth)
    
    rowIndex++
    
    
    if (unitData.healer ) {
      this.HealNameLabel = this.scene.add.text(
        leftX,
        labelY + deltaY * rowIndex,
        "Heal Amount/Delay:",
        {
          ...fontConfig,
          align: "left"
        }
      ).setOrigin(0,.5)
        .setDepth(this.depth)
        
      
      
      this.threatModValueLabel = this.scene.add.text(
        rightX,
        labelY + deltaY * rowIndex,
        unitData.healer.amount+"/"+unitData.healer.delay,
        {
          ...fontConfig,
          align: "right"
        }
      ).setOrigin(1,.5)
        .setDepth(this.depth)
        this.labels.push(this.threatModNameLabel)
        this.labels.push(this.threatModValueLabel)
       rowIndex++
    }
    if (unitData.threatMods.attack > 1.0) {
      this.threatModNameLabel = this.scene.add.text(
        leftX,
        labelY + deltaY * rowIndex,
        "Threat Modifier:",
        {
          ...fontConfig,
          align: "left"
        }
      ).setOrigin(0,.5)
        .setDepth(this.depth)
        
      
      
      this.threatModValueLabel = this.scene.add.text(
        rightX,
        labelY + deltaY * rowIndex,
        unitData.threatMods.attack,
        {
          ...fontConfig,
          align: "right"
        }
      ).setOrigin(1,.5)
        .setDepth(this.depth)
        this.labels.push(this.threatModNameLabel)
        this.labels.push(this.threatModValueLabel)
       rowIndex++
    }
    
    
      
    this.labels.push( ...[
      this.nameLabel,
      this.classLabel,
      this.levelNameLabel,
      this.levelValueLabel,
      this.hpNameLabel,
      this.hpValueLabel,
      this.acNameLabel,
      this.acValueLabel,
      this.damageDelayNameLabel,
      this.damageDelayValueLabel
    ])

  }
  
  toggleSelected(value) {
    
    if (value === undefined) {
      value = !this.selected
    }
    this.selected = value
    var color = value ? 0xbbffbb : 0xffffff
    
    
    this.bg.setFillStyle(color)
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