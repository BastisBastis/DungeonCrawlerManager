import {
  hasComponent
} from "bitecs"

import { UnitNames } from "../data/UnitNames" 

import { Name } from "../components/Name" 

import * as Utils from "../helpers/Utils" 

var unitNameIndices = []

export const NameHelper = {
  GetName : (world, id) => {
    //console.log(world,id)
    if (hasComponent(world, Name, id)) 
      return UnitNames[Name.index[id]]
    else
      return "Enemy_"+id
  },
  resetNameList : () => {
    unitNameIndices = []
    for (let i = 0; i < UnitNames.length; i++)
      unitNameIndices.push(i)
    
    Utils.shuffleArray(unitNameIndices)
  },
  getNextNameIndex : () => {
    const nameIndex = unitNameIndices.pop()
    if (unitNameIndices.length == 0)
      NameHelper.resetNameList()
    return nameIndex
  }
}

NameHelper.resetNameList()

