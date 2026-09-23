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
    gameSpeed : 1,
    timeOutsLeft: 1
  }
}

export const resetMenuStore = () => {
  Store.menu = {
    recruitmentPool : []
  }
}

export const resetRunStore = ()=>{
  resetMenuStore()
  resetDungeonStore()
  Store.run = {}
  Store.run.gold = 40
  Store.run.units = []
  Store.run.party = []
  Store.run.deadUnits = []
  Store.run.levelIndex = 0
  Store.run.tactics = {}
}

export const resetMetaStore = ()=>{
  Store.meta = {}
  Store.meta.gems = 0
  Store.meta.totalDungeons = 0
  Store.meta.progression = {
    gold: 0,
    training: 0,
    traitPool: 0,
    basicTactics: 0,
    timeOut: 0
  }
}

resetStore()

