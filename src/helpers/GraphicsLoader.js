import Player from "../assets/images/RunSkeleton.png" 
import MenuBg1 from "../assets/images/Dcmbg1.PNG" 

export const preloadGraphics = (scene)=>{
  scene.load.spritesheet("player",Player,{
    frameWidth:256,
    frameHeight:256
  })
  scene.load.image("menuBg", MenuBg1)
}