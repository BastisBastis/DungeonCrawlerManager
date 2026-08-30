export const Store = {}

export const resetStore = ()=>{
  resetRunStore()
  resetDungeonStore()
  resetMenuStore()
  resetMetaStore()
}

export const resetDungeonStore = () => {
  Store.dungeon = {
    paused : false,
    gameSpeed : 1
  }
}

export const resetMenuStore = () => {
  Store.menu = {
    currentView : "main",
    recruitmentPool : []
  }
}

export const resetRunStore = ()=>{
  Store.run = {}
  Store.run.gold = 40
  Store.run.units = []
  Store.run.party = []
  Store.run.deadUnits = []
  Store.run.levelIndex = 0
}

export const resetMetaStore = ()=>{
  
}

resetStore()

