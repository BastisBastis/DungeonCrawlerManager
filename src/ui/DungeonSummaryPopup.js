import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"
import { Window } from "./Window"

import { Button } from "./Button"


import { Palette } from "../data/Palette" 
import { Store } from "../helpers/Store" 

export class DungeonSummaryPopup extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    summary,
    config={}
  ) {
    
    const {
      width=1200,
      height=1000,
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
    //console.log(summary)
    this.summary = summary
    
    const top=y-height/2
    const left=x-width/2
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:100,
      height:80,
      depth:depth,
    }
    
    this.children.push(new Button(scene,
      x,top+height*0.9,confirmString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onConfirm()
        }
      }
    ))
    
    this.selectedFightIndex = -1
    this.fightItems = []
    this.setupFightTabButtons()
    this.setFightIndex(0)

  }
  
 
  
  

  setupFightTabButtons() {
    const buttonStrings = ["TOTAL"]
    for (let i = 0; i < this.summary.fightSummaries.length; i++) 
      buttonStrings.push("FIGHT " + (i+1))

    const deltaX = this.width/buttonStrings.length
    const y = this.y-this.height/2 + 50

    const selectedColor = Palette.blue1.string
    const deselectedColor = Palette.grey5.string
    const btnConfig={
      fontSize:40,
      width:200,
      height:80,
      depth:this.depth+2,
      fontColor: deselectedColor,
      backgroundColor: Palette.beige2.hex,
      borderThickness: 0
    }
    

    this.fightTabButtons = []


    buttonStrings.forEach((string, i) => {
      //console.log("Making button")
      const button = new Button(
        this.scene,
        this.x - this.width/2 + (i+.5) * deltaX,
        y,
        string,
        {
          ...btnConfig,
          onClick:()=> {
           try { 
           
            this.setFightIndex(i)
            } catch (er) {console.log(er.message,er.stack); throw er} 
            this.fightTabButtons.forEach(btn=>{
              btn.label.setColor(deselectedColor)
              btn.fontColor = deselectedColor
            })
            button.label.setColor(selectedColor)
            button.fontColor = selectedColor
          }
        }
      )
      //console.log(this.scene, button, button.x, button.y)
      this.fightTabButtons.push(button)
      this.children.push(button)
      if (i == 0) {
        button.label.setColor(selectedColor)
        button.fontColor = selectedColor
      }

    })

  }

  setFightIndex(index) {
    if (index == this.selectedFightIndex)
      return
    this.selectedFightIndex = index
    
    var summary
    
    
    if (index == 0) {
      summary = {
        duration: 0,
        heroes: {},
        enemies: {}
      }
    
      for (const fightSummary of this.summary.fightSummaries) {
        summary.duration += fightSummary.duration
        console.log("duration "+summary.duration)
    
        for (const [id, hero] of Object.entries(fightSummary.heroes)) {
         
          if (summary.heroes[id]) {
            summary.heroes[id].damageDealt += hero.damageDealt
            summary.heroes[id].damageTaken += hero.damageTaken
            summary.heroes[id].healReceived += hero.healReceived
            summary.heroes[id].healDealt += hero.healDealt
          }
          else {
            summary.heroes[id] = {
              ...hero
            }
          }
        } 
    
        for (const [id, enemy] of Object.entries(fightSummary.enemies)) {
          if (summary.enemies[id]) {
            summary.enemies[id].damageDealt += enemy.damageDealt
            summary.enemies[id].damageTaken += enemy.damageTaken
            summary.enemies[id].healReceived += enemy.healReceived
            summary.enemies[id].healDealt += enemy.healDealt
          }
          else {
            summary.enemies[id] = {
              ...enemy
            }
          }
        } 
    
      } 
    
    } 
    else
      summary = this.summary.fightSummaries[index-1]
    //console.log(summary)
    
    this.fightItems.forEach(item=>item.destroy())
    this.fightItems = []
    
    const heroX = this.x-this.width/2 + 20
    const heroValueX = heroX + 200
    var startY = this.y-this.height/2 +100
    var heroY = startY
    var enemyY = startY
    const detailSize = 18
    
    const enemyX = this.x+this.width/2 - 250
    const enemyValueX = enemyX+200
    
    
    const deltaY = 22
    
    
    
    
    for (const hero of Object.values(summary.heroes)) {
     const heroContent = [
     [hero.name],
     ["Damage dealt:", hero.damageDealt],
     ["Damage dealt / second", Math.round((hero.damageDealt/summary.duration)*10000)/10],
     ["Damage taken:", hero.damageTaken],
     ["Healing dealt:", hero.healDealt],
     ["Healing received:", hero.healReceived],
    ]
     //console.log(hero)
     for (const [i, labelStrings] of Object.entries(heroContent)) {
      
      this.addFightLabel(
       heroX,
       heroY,
       labelStrings[0],
       i===0?24:detailSize
      )
      
      if (i == 0)
       heroY += deltaY/2
      
      if (labelStrings.length>1) {
        this.addFightLabel(
         heroValueX,
         heroY,
         labelStrings[1],
         
         detailSize
        )
      }
      
      heroY += deltaY
      
     }
     
     
      heroY += deltaY
    }
    
    if (index == 0) {
     return
    }
     
    for (const enemy of Object.values(summary.enemies)) {
     const enemyContent = [
     [enemy.name],
     ["Damage dealt:", enemy.damageDealt],
     ["Damage dealt / second", Math.round((enemy.damageDealt/summary.duration)*10000)/10],
     ["Damage taken:", enemy.damageTaken],
     ["Healing dealt:", enemy.healDealt],
     ["Healing received:", enemy.healReceived],
    ]
     //console.log(hero)
     for (const [i, labelStrings] of Object.entries(enemyContent)) {
      
      this.addFightLabel(
       enemyX,
       enemyY,
       labelStrings[0],
       i===0?24:detailSize
      )
      
      if (i == 0)
       enemyY += deltaY/2
      
      if (labelStrings.length>1) {
        this.addFightLabel(
         enemyValueX,
         enemyY,
         labelStrings[1],
         
         detailSize
        )
      }
      
      enemyY += deltaY
      
     }
     
     
      enemyY += deltaY
    }
    
    
  }
  
  addFightLabel(x, y, string, size, config = {}) {
   //
   
   const label = this.scene.add.text(
    x,
    y,
    string,
    {
     fontSize: size,
     color: "#000000",
     depth: this.depth+2,
     fontFamily: GlobalStuff.FontFamily,
     
     ...config
    }
   ).setDepth(this.depth+1)
   this.fightItems.push(label)
   return label
  }
  
  static prompt(scene,x,y,summary,config={}) {
    return new Promise((resolve,reject)=>{
      try { 

      const c=new DungeonSummaryPopup(scene,x,y,summary,{
        ...config,

        onConfirm:()=>{
          resolve(1)
        }
      })
      } catch (er) {console.log(er.message,er.stack); throw er} 
    })
  }
  
  destroy() {
    super.destroy()
    this.children.forEach(child=>child.destroy())
    this.fightItems.forEach(item=>item.destroy())
  }
  
}