const getGrid = (width, height)=>{
  var map = []
  for (let col = 0; col < width; col++) {
    var column = []
    
    for (let row = 0; row < height; row++) {
      column.push({
        walkable: false,
        cost: 1
      })
    }
    
    map.push(column)
  }
  return map
}

const levels = [
  {
    width:32,
    height:32,
    cellSize: 128,
    playerSpawn: {
      x: 3,
      y: 3
    },
    goal: {
      x: 12,
      y: 20
    },
    spawnPoints: [ //make this an array of dictionaries instead
      [3,11, 1, 0], //col, row, number of enemies, mob id
      [6,11,3, 0],
      [10,18,1, 1],
      [11,18,2, 0]
    ],
    checkPoints: [
      {
        x:3,
        y: 11
      },
      {
        x:9,
        y:11
      },
      {
        x: 9,
        y: 18
      },
      {
        x: 12,
        y: 20
      }
    ],
    carvings:[
      {
        col: 3,
        row: 3,
        dir: "s",
        length: 8
      },
      {
        col: 3,
        row: 11,
        dir: "e",
        length: 6
      },
      {
        col: 5,
        row: 10,
        dir: "e",
        length: 3
      },
      {
        col: 5,
        row: 12,
        dir: "e",
        length: 3
      },
      {
        col: 9,
        row: 11,
        dir: "s",
        length: 10
      },
      {
        col: 10,
        row: 17,
        dir: "s",
        length: 4
      },
      {
        col: 11,
        row: 17,
        dir: "s",
        length: 4
      },
      {
        col: 12,
        row: 17,
        dir: "s",
        length: 4
      },
    ]
  },
  {
    width:32,
    height:32,
    cellSize: 128,
    playerSpawn: {
      x: 3,
      y: 3
    },
    goal: {
      x: 13,
      y: 14
    },
    spawnPoints: [ //make this an array of dictionaries instead
      [5,2, 1, 2], //col, row, number of enemies
      [5,4, 1, 2],
      [6,7,2, 2],
      [8,7,2, 2],
      [6,14,1, 3],
      [7,15,2, 2]
    ],
    checkPoints: [
      {
        x:7,
        y: 3
      },
      {
        x:7,
        y:14
      },
      {
        x: 13,
        y: 14
      },
      
    ],
    carvings:[
      {
        col: 3,
        row: 3,
        dir: "e",
        length: 4
      },
      {
        col: 4,
        row: 2,
        dir: "s",
        length: 3
      },
      {
        col: 5,
        row: 2,
        dir: "s",
        length: 3
      },
      {
        col: 7,
        row: 3,
        dir: "s",
        length: 11
      },
      {
        col: 6,
        row: 5,
        dir: "s",
        length: 3
      },
      {
        col: 8,
        row: 5,
        dir: "s",
        length: 3
      },
      {
        col: 7,
        row: 14,
        dir: "e",
        length: 7
      },
      {
        col: 8,
        row: 13,
        dir: "s",
        length: 1
      },
      {
        col: 6,
        row: 13,
        dir: "s",
        length: 3
      },
      {
        col: 7,
        row: 15,
        dir: "e",
        length: 2
      },
    ]
  },
  {
    width:32,
    height:32,
    cellSize: 128,
    playerSpawn: {
      x: 3,
      y: 3
    },
    goal: {
      x: 5,
      y: 14
    },
    spawnPoints: [ //make this an array of dictionaries instead
      [4,7, 2, 4], //col, row, number of enemies
      [7,7, 3, 4],
      [6,10,2, 4],
      [1,12,2, 4],
      [3,12,1, 4],
    ],
    checkPoints: [
      {
        x:3,
        y: 7
      },
      {
        x:6,
        y:7
      },
      {
        x: 6,
        y: 10
      },
      {
        x: 2,
        y: 10
      },
      {
        x: 2,
        y: 14
      },
      {
        x: 5,
        y: 14
      },
      
    ],
    carvings:[
      {
        col: 3,
        row: 3,
        dir: "s",
        length: 5
      },
      {
        col: 4,
        row: 6,
        dir: "s",
        length: 1
      },
      {
        col: 3,
        row: 7,
        dir: "e",
        length: 5
      },
      {
        col: 6,
        row: 7,
        dir: "s",
        length: 4
      },
      {
        col: 6,
        row: 10,
        dir: "w",
        length: 5
      },
      {
        col: 2,
        row: 10,
        dir: "s",
        length: 5
      },
      {
        col: 1,
        row: 11,
        dir: "e",
        length: 3
      },
      {
        col: 1,
        row: 12,
        dir: "e",
        length: 3
      },
      {
        col: 2,
        row: 14,
        dir: "e",
        length: 4
      },
      
    ]
  }
  
]


export const DungeonGenerator = {
  getLevel: (index) =>{
   
    if (index >= levels.length) {
      console.log("Level index out of range")
      return null
    }
    var levelData = levels[index]
    var map = getGrid(levelData.width, levelData.height)
    for (const carving of levelData.carvings) {
      var deltaX = 0
      var deltaY = 0
      if (carving.dir == "s")
        deltaY=1
      else if (carving.dir == "n")
        deltaY=-1
      else if (carving.dir == "e")
        deltaX=1
      else if (carving.dir == "w")
        deltaX=-1
      for (let i = 0; i< carving.length; i++) {
        var cell = map[carving.col + deltaX*i][carving.row + deltaY * i]
        cell.walkable = true
      }
    }
    
    levelData.map = map
    return levelData
  }
}