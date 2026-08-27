export const Store = {}

export const resetStore = ()=>{
  Store.paused = false
  Store.gameSpeed = 1
  
  Store.selectedUnits = []
  
  Store.availableUnits = []
  
  Store.gold = 0
  
  Store.menu = {}
  
  Store.units = []
  Store.recruitmentPool = []
  Store.party = []
  Store.deadUnits = []
  
  
  resetMenuStore()
  
}

export const resetMenuStore = () => {
  console.log("Reset menu store")
  Store.menu.currentView = "main"
  Store.paused = false
  Store.gameSpeed = 1
}

resetStore()

