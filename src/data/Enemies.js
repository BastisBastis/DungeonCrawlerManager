import { UnitClass } from "../components/ClassType" 

export const Enemies = []

Enemies[0] = {
  name : "a Weak Goblin",
  classType : UnitClass.WARRIOR,
  level: 1,
  hpMin : 40,
  hpMax : 70,
  acMin : 4,
  acMax : 8,
  damageMin : 8,
  damageMax : 13,
  delayMin : 20,
  delayMax : 25,
  atkMin : 8,
  atkMax : 15,
  modelIndex : 3,
  attackBuildUp : 500
}

Enemies[1] = {
  name : "a Strong Goblin",
  classType : UnitClass.WARRIOR,
  level: 2,
  hpMin : 50,
  hpMax : 80,
  acMin : 8,
  acMax : 10,
  damageMin : 11,
  damageMax : 17,
  delayMin : 25,
  delayMax : 28,
  atkMin : 8,
  atkMax : 15,
  modelIndex : 3,
  attackBuildUp : 400
}

Enemies[2] = {
  name : "a Skeleton",
  classType : UnitClass.WARRIOR,
  level: 2,
  hpMin : 50,
  hpMax : 80,
  acMin : 8,
  acMax : 10,
  damageMin : 11,
  damageMax : 17,
  delayMin : 25,
  delayMax : 28,
  atkMin : 8,
  atkMax : 15,
  modelIndex : 4,
  attackBuildUp : 550
}

Enemies[3] = {
  name : "a Zombie",
  classType : UnitClass.WARRIOR,
  level: 3,
  hpMin : 80,
  hpMax : 120,
  acMin : 10,
  acMax : 14,
  damageMin : 22,
  damageMax : 30,
  delayMin : 40,
  delayMax : 50,
  atkMin : 8,
  atkMax : 15,
  modelIndex : 5,
  attackBuildUp : 900
}

Enemies[4] = {
  name : "a Lizardman",
  classType : UnitClass.WARRIOR,
  level: 3,
  hpMin : 80,
  hpMax : 120,
  acMin : 10,
  acMax : 14,
  damageMin : 13,
  damageMax : 19,
  delayMin : 25,
  delayMax : 28,
  atkMin : 8,
  atkMax : 15,
  modelIndex : 6,
  attackBuildUp : 500
}

Enemies[5] = {
  name : "a Ghost",
  classType : UnitClass.WARRIOR,
  level: 4,
  hpMin : 100,
  hpMax : 140,
  acMin : 12,
  acMax : 16,
  damageMin : 20,
  damageMax : 30,
  delayMin : 25,
  delayMax : 35,
  atkMin : 12,
  atkMax : 20,
  modelIndex : 7,
  attackBuildUp : 500
}
