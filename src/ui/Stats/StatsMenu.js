import Phaser from "phaser"


//helpers
import { EventCenter } from "../../helpers/EventCenter" 
import { GlobalStuff } from "../../helpers/GlobalStuff"
import * as Utils from "../../helpers/Utils"
import { Store } from "../../helpers/Store"
import { getDungeonSummary , getAllDungeonLogs, getTotalDungeonStatSummary} from "../../systems/StatSystem" 

//Data
import { Palette } from "../../data/Palette" 
import { UnitNames } from "../../data/UnitNames" 
import { TraitList } from "../../data/Traits" 

//UI
 
import { Button } from "../Button"
import { UnitDetails } from "../Tavern/UnitDetails"
import { Popup } from "../Popup" 
import { Window } from "../Window"
import { DungeonSummaryPopup } from "../DungeonSummaryPopup"
import { TraitDetails } from "../Popups/TraitDetails"



export class StatsMenu extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    config={}
  ) {
    
    const {
      width=1200,
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
    this.subViews = []
    this.subSubViews = []
    
    
    this.unitDetails = null
    this.unitDetailsPosition = {
      x: this.scene.cameras.main.width - 300,
      y: this.scene.cameras.main.height / 2 - 200
    }
    
    
    const btnConfig={
      fontSize:32,
      width:100,
      height:80,
      depth:depth,
    }
    
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
    
    this.showSectionButtons()
    this.showUnitView()
    
    //this.showDungeonSummaryView()
    
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  showSectionButtons() {
   const y = this.y-this.height/2+60
   const numSections = 2
   const deltaX = this.width/numSections
   
   var startX = this.x-this.width/2+deltaX/2
   
   const selectedColor = Palette.blue1.string
   const deselectedColor = Palette.grey5.string
   const btns = []
   const btnConfig={
      fontSize:36,
      width:200,
      height:48,
      depth:this.depth+100,
      fontColor: deselectedColor,
      backgroundColor: Palette.beige2.hex,
      borderThickness: 0
    }
   
   const unitsButton = new Button(
    this.scene,
    startX + deltaX * 0,
    y,
    "UNITS",
    {
     ...btnConfig,
     fontColor: selectedColor,
     onClick:()=> {
      this.showUnitView()
      btns.forEach(btn=>{
       btn.label.setColor(deselectedColor)
       btn.fontColor = deselectedColor
      })
      unitsButton.label.setColor(selectedColor)
      unitsButton.fontColor = selectedColor
     }
    }
   )
   
   const dungeonsButton = new Button(
    this.scene,
    startX + deltaX * 1,
    y,
    "DUNGEONS",
    {
     ...btnConfig,
     onClick:()=> {
      this.showDungeonSummaryView()
      btns.forEach(btn=>{
       btn.label.setColor(deselectedColor)
       btn.fontColor = deselectedColor
      })
      dungeonsButton.label.setColor(selectedColor)
      dungeonsButton.fontColor= selectedColor
     }
    }
   )
   
   btns.push(unitsButton, dungeonsButton)
   this.gameObjects.push(unitsButton, dungeonsButton)
   
  }
  
  showUnitView() {
   this.subViews.forEach(view=>view.destroy())
   this.subViews = []
   this.subSubViews.forEach(view=>view.destroy())
   this.subSubViews = []
   
   
   const retiredUnits = Store.run.units.filter((_unit, index)=>{
    return !Store.run.party.includes(index)
   })
   const activeUnits = []
   Store.run.party.forEach(index=>{
    activeUnits.push(Store.run.units[index])
   })
   activeUnits.sort((a,b)=>{
    return a.name < b.name ? -1 : 1
   })
   
   this.allUnits = [
    ...activeUnits,
    ...retiredUnits
   ]
   
   this.allUnitsStats = getTotalDungeonStatSummary()
   this.lastDungeonSummary = getDungeonSummary()
   
   //console.log(Store.run.party)
   //console.log(retiredUnits)
   
   const activeX = this.x - this.width/2 + 180
   const retiredX = this.x + this.width/2 - 180
   const startY = this.y - this.height/2 + 200
   const unitDeltaY = 70
   
   const selectedColor = Palette.blue1.string
    const deselectedColor = Palette.grey5.string
   const btnConfig={
      fontSize:36,
      width:140,
      height:48,
      depth:this.depth+100,
      fontColor: deselectedColor,
      backgroundColor: Palette.beige2.hex,
      borderThickness: 0
    }
   
   const activeLabel = this.scene.add.text(
    activeX,
    startY,
    "PARTY",
    {
     fontSize: btnConfig.fontSize,
     color: Palette.blue2.string,
     fontFamily: GlobalStuff.FontFamily
    }
   ).setDepth(this.depth+1)
   .setOrigin(.5,.5)
   const retiredLabel = this.scene.add.text(
    retiredX,
    startY,
    "RETIRED/DEAD",
    {
     fontSize: btnConfig.fontSize,
     color: Palette.blue2.string,
     fontFamily: GlobalStuff.FontFamily
    }
   ).setDepth(this.depth+1)
   .setOrigin(.5,.5)
   this.subViews.push(activeLabel, retiredLabel)
   
   const btnDeltaY = 60
   
   const unitButtons = []
   
   
   activeUnits.forEach((unit, i) =>{
    
     const button = new Button(
        this.scene,
        activeX,
        startY + (i+1) * unitDeltaY,
        unit.name,
        {
          ...btnConfig,
          onClick:()=> {
           try { 
            
            this.showUnitDetails(i)
            
            } catch (er) {console.log(er.message,er.stack); throw er} 
            unitButtons.forEach(btn=>{
              btn.label.setColor(deselectedColor)
              btn.fontColor = deselectedColor
            })
            button.label.setColor(selectedColor)
            button.fontColor = selectedColor
          }
        }
      )
      unitButtons.push(button)
      //console.log(this.scene, button, button.x, button.y)
      this.subViews.push(button)
      
      if (i == 0) {
        button.label.setColor(selectedColor)
        button.fontColor = selectedColor
      }

    })
   
   
   retiredUnits.forEach((unit, i) =>{
    
    
    var name = unit.name
    
    if (Store.run.deadUnits.includes(unit.unitIndex))
     name += "(DEAD)"
    
     const button = new Button(
        this.scene,
        retiredX,
        startY + (i+1) * unitDeltaY,
        name,
        {
          ...btnConfig,
          onClick:()=> {
           try { 
            
            this.showUnitDetails(i + activeUnits.length)
            
            } catch (er) {console.log(er.message,er.stack); throw er} 
            unitButtons.forEach(btn=>{
              btn.label.setColor(deselectedColor)
              btn.fontColor = deselectedColor
            })
            button.label.setColor(selectedColor)
            button.fontColor = selectedColor
          }
        }
      )
      unitButtons.push(button)
      //console.log(this.scene, button, button.x, button.y)
      this.subViews.push(button)
      
      

    })
   //})
   
   
   
   /*
     name
     class
     level
     hitpoints
     ac
     damage
     attack cooldown
     atk
     healAmount (if healer)
     heal cooldown (if healer)
     threatMod (if warrior)
     
     last dungeon DPS
     total DPS
     num Dungeons
     
     traits (with hover tooltip)
     
   */
   this.showUnitDetails(0)
  }
  
  showUnitDetails(index) {
   this.subSubViews.forEach(view=>{view.destroy()})
   this.subSubViews = []
   
   //console.log(this.allUnits[index])
   const unit = this.allUnits[index]
   
   let y = this.y - this.height/2 + 200
   const deltaY = 34
   const config = {
    fontSize : 28,
    color: Palette.brown4,
    fontFamily: GlobalStuff.FontFamily
   }
   
   var name = unit.name
   if (Store.run.deadUnits.includes(unit.unitIndex))
     name += "(DEAD)"
     
   const unitStats = this.allUnitsStats[unit.unitIndex]
   
   const strings = [
    [name, unit.classType],
    ["Hitpoints:", Math.round(unit.hitpoints)],
    ["Armor Class:", Math.round(unit.armorClass)],
    ["Attack Damage:", Math.round(unit.damage)],
    ["Attack Cooldown:", Math.round(unit.delay)],
    ["Attack Skill:", Math.round(unit.atk)]
   ]

   if (unit.mana) {
      strings.push(
        ["Mana", Math.round(unit.mana)]
      )
    }

   if (unit.healer) {
    strings.push(
     ["Heal Amount:", Math.round(unit.healer.amount)],
     ["Heal Cooldown:", Math.round(unit.healer.delay)],
    )
   }
   if (unit.threatMods.attack > 1.0) {
    strings.push([
     "Threat Modifier:", Math.round(unit.threatMods.attack*10)/10
    ])
   }
   
   strings.push(["",""])
   
   strings.push([
    "Dungeons crawled:",
    unitStats? unitStats.numDungeons : "0"
   ])
   
   if (unitStats) {
    const lastDungeonSummary = getDungeonSummary()
    if (lastDungeonSummary.unitsTotal[unit.unitIndex])
      strings.push(
        [
          "Last dungeon DPS:", Math.round((lastDungeonSummary.unitsTotal[unit.unitIndex].damageDealt / lastDungeonSummary.unitsTotal[unit.unitIndex].duration)*10000)/10
        ]
      )
    strings.push(
      [
        "Average DPS:", Math.round((unitStats.damageDealt/unitStats.duration)*10000)/10
      ]
    )
   }
   
   const leftX = this.x - 220
   const rightX = this.x + 120
   
   var finalY = 0
   
   for (const [i, string] of strings.entries()) {
    
    const labelL = this.scene.add.text(
     leftX,
     y + deltaY*i,
     string[0],
     config
    ).setDepth(this.depth+10)
    
    const labelR = this.scene.add.text(
     rightX,
     y + deltaY*i,
     string[1],
     config
    ).setDepth(this.depth+10)
    
    finalY = y + deltaY*(i+2),
    
    this.subSubViews.push(labelL, labelR)
    
   }
   
   if (unit.traits.length > 0) {
    this.subSubViews.push(
     this.scene.add.text(
     this.x,
     finalY,
     "TRAITS: (hover for details)",
     config
    ).setDepth(this.depth+10)
    .setOrigin(.5,.5)
    )
    finalY += deltaY
   }
   
   for (let i = 0; i < unit.traits.length; i++) {
    const label = this.scene.add.text(
     this.x,
     finalY,
     TraitList[unit.traits[i]].name,
     config
    ).setDepth(this.depth+10)
    .setOrigin(.5,.5)
    
    label.setInteractive(
     new Phaser.Geom.Rectangle(
      0,
      0,
      label.width,
      label.height
     ),
     Phaser.Geom.Rectangle.Contains
     )
    .on("pointerover", ()=>(this.showTraitInfo(unit.traits[i])))
    .on("pointerout", ()=>{this.closeTraitInfo()})
    
    this.subSubViews.push(label)
    
    finalY+= deltaY
   }
   
  }
  
  showTraitInfo(traitIndex) {
   try { 
   this.closeTraitInfo()
   this.traitDetails = new TraitDetails(
    this.scene,
    this.x + this.width/2 - 220,
    this.y,
    traitIndex ,{
     depth: this.depth+100
    }
   )
   } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  closeTraitInfo() {
   try { 
   if (this.traitDetails) {
    this.traitDetails.destroy()
    this.traitDetails = null
   }
   } catch (er) {console.log(er.message,er.stack); throw er}
  }

  showDungeonSummaryView() {
   this.subViews.forEach(view=>view.destroy())
   this.subViews =[]
   
    var numDungeons = getAllDungeonLogs().length
    
    numDungeons = Math.max(numDungeons, 1)
    
    
    
    const buttonStrings = []
    for (let i = 0; i < numDungeons; i++) 
      buttonStrings.push((i+1))
      
    const areaWidth = this.width*.75

    const deltaX = areaWidth/buttonStrings.length
    const y = this.y-this.height/2 + 140

    const selectedColor = Palette.blue1.string
    const deselectedColor = Palette.grey5.string
    const btnConfig={
      fontSize:36,
      width:80,
      height:48,
      depth:this.depth+100,
      fontColor: deselectedColor,
      backgroundColor: Palette.beige2.hex,
      borderThickness: 0
    }
    
    const dungeonTitle = this.scene.add.text(
     this.x - this.width/2 + 40,
     y,
     "DUNGEON:",
     {
      fontSize: btnConfig.fontSize,
      color: deselectedColor,
      fontFamily: GlobalStuff.FontFamily
     }
    ).setDepth(this.depth+10)
    .setOrigin(0,.5)
    
    this.subViews.push(dungeonTitle)

    const dungeonTabButtons = []


    buttonStrings.forEach((string, i) => {
      //console.log("Making button")
      const button = new Button(
        this.scene,
        this.x - areaWidth/2 + (i+.5) * deltaX,
        y,
        string,
        {
          ...btnConfig,
          onClick:()=> {
           try { 
           
            this.showDungeonSummary(i)
            } catch (er) {console.log(er.message,er.stack); throw er} 
            dungeonTabButtons.forEach(btn=>{
              btn.label.setColor(deselectedColor)
              btn.fontColor = deselectedColor
            })
            button.label.setColor(selectedColor)
            button.fontColor = selectedColor
          }
        }
      )
      dungeonTabButtons.push(button)
      //console.log(this.scene, button, button.x, button.y)
      this.subViews.push(button)
      
      if (i == 0) {
        button.label.setColor(selectedColor)
        button.fontColor = selectedColor
      }

    })
    
    
    this.showDungeonSummary(0)
  }

  showDungeonSummary(index) {
   this.subSubViews.forEach(view=>{
    view.destroy()
   })
   this.subSubViews = []
   
   var summary = getDungeonSummary(index)
   /*
   if (index == 0) {
    summary = {
     fightSummaries:[{
      heroes: getTotalDungeonStatSummary(),
      enemies:{}
     }]
    }
   } else {
    summary = getDungeonSummary(index -1)
   }*/
   
   const summaryView = new DungeonSummaryPopup(
    this.scene,
    this.x,
    this.y+100,
    summary,
    {
     showAsWindow:false,
     depth:this.depth+10
    }
   )
   
   this.subSubViews.push(summaryView)
  }
  
  
  destroy() {
   super.destroy()
    this.gameObjects.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    if (this.unitDetails)
      this.unitDetails.destroy()
    this.subViews.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    this.subSubViews.forEach(object=>{
      if (object && object.destroy)
        object.destroy()
    })
    
    if (this.traitDetails && this.traitDetails.destroy)
     this.traitDetails.destroy()
     
    this. traitDetails = null
     
    this.gameObjects=[]
  }
  
}