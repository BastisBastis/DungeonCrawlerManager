import Phaser from 'phaser'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js'


import Game from "./scenes/Game"
import DungeonScene from "./scenes/DungeonScene"
import UI from "./scenes/UI"
import GameMenu from "./scenes/GameMenu"
import Loading from "./scenes/Loading"


try { 



const config = {
    type: Phaser.WEBGL,
    transparent:false,
    parent:"phaserContainer",
    fps: {
      //limit: 60
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: 1080,
      width: 1920,
    }, 
    scene: [
      Loading,
      Game,
      GameMenu,
      DungeonScene,
      UI
    ],
    dom: {
        createContainer: true
    },    
    plugins: {
      global: [{
        key: 'rexWebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      },
     
      ]
    }
};


  const game = new Phaser.Game(config);
  
} catch (er) {console.log(er.message,er.stack); throw er} 
