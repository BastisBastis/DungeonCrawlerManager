import Phaser from "phaser"
import {GlobalStuff} from "../../helpers/GlobalStuff"
import {EventCenter} from "../../helpers/EventCenter"
import { Window } from "../Window"

import { Button } from "../Button"

import { TraitList } from "../../data/Traits" 



import { Palette } from "../../data/Palette" 
import { Store } from "../../helpers/Store" 

export class TraitAwardPopup extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    traitData,
    config={}
  ) {
    
    const {
      width=600,
      
      depth=100,
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
      backgroundColor = Palette.beige2.hex,
      showAsWindow = true,
      hideFightButtons = false
    }=config
    
    var height = 0
   
    
    //console.log(summary)
    
    
    const top=y-height/2
    const left=x-width/2
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:100,
      height:80,
      depth:depth,
    }
    
    const margins =40
    height = margins
    
     
    const closeBtn = new Button(scene,
     x,top+height - 100,confirmString,{
       ...btnConfig,
       
       onClick:()=>{
         this.destroy()
         onConfirm()
       }
     })
    
     height += closeBtn.height + margins
    
    
    
    const labelConfig = {
     fontSize : 32,
     fontFamily,
     color: fontColor,
    }
    
    const titleLabel = scene.add.text(
     x,
     y - height/2 + 100,
     Store.run.units[traitData.unitIndex].name +" developed a new trait:",
     labelConfig
     
    ).setDepth(depth)
    .setOrigin(.5,0)
    
    height += titleLabel.height + margins
    
    const traitNameLabel = scene.add.text(
     x,
     y - height/2 + 180,
     TraitList[traitData.traitIndex].name,
     {
      ...labelConfig,
      fontSize: 40
      
     }
    ).setDepth(depth)
    .setOrigin(.5,0)
    
    height += traitNameLabel.height + margins
    
    const reasonLabel = scene.add.text(
     x,
     y - height/2 + 60,
     traitData.reason,
     {
      ...labelConfig,
      fontSize: 24,
      align: "center",
      wordWrap: {
        width: width - 100,
        useAdvancedWrap: false
    }
      
     }
    ).setDepth(depth)
    .setOrigin(.5,0)
    
    height += reasonLabel.height + margins
    
    
    const descriptionLabel = scene.add.text(
     x,
     y - height/2 + 60,
     TraitList[traitData.traitIndex].description,
     {
      ...labelConfig,
      fontSize: 24,
     align: "center",
      wordWrap: {
        width: width - 100,
        useAdvancedWrap: false
    }
      
     }
    ).setDepth(depth)
    .setOrigin(.5,0)
    
    height += descriptionLabel.height + margins
    
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth:depth-1,
      backgroundColor,
      blockBackground:showAsWindow,
      blockerTweenDuration:300,
      blockAlpha:0.2,
      borderColor
    })
    
    this.children.push(
     closeBtn,
     titleLabel,
     reasonLabel,
     traitNameLabel,
     descriptionLabel
    )
  
    reasonLabel.y = y-height/2+margins
    
    titleLabel.y = reasonLabel.y + reasonLabel.height + margins
    traitNameLabel.y = titleLabel.y + titleLabel.height + margins
    descriptionLabel.y = traitNameLabel.y + traitNameLabel.height + margins
    closeBtn.y = descriptionLabel.y + descriptionLabel.height + margins + closeBtn.height/2
    
    
  }
  
 
  static prompt(scene,x,y,traitData,config={}) {
    return new Promise((resolve,reject)=>{
      try { 

      const c=new TraitAwardPopup(scene,x,y,traitData,{
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
    
  }
  
}