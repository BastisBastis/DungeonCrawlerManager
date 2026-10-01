import { UnitClass } from "../components/ClassType" 

export const EnemyType = {
  HUMANOID: 0,
  UNDEAD: 1
}

export const Enemies = []

Enemies[0] = {
  name : "a Goblin",
  classType : UnitClass.WARRIOR,
  level: 1,
  hpMin : 55,
  hpMax : 55,
  acMin : 6,
  acMax : 6,
  damageMin : 11,
  damageMax : 11,
  delayMin : 22,
  delayMax : 22,
  atkMin : 12,
  atkMax : 12,
  modelIndex : 3,
  attackBuildUp : 500,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 1,
  type: EnemyType.HUMANOID
}

Enemies[6] = {
  name : "a Goblin Scout",
  classType : UnitClass.WARRIOR,
  level: 1,
  hpMin : 65,
  hpMax : 65,
  acMin : 5,
  acMax : 5,
  damageMin : 8,
  damageMax : 8,
  delayMin : 14,
  delayMax : 14,
  atkMin : 11,
  atkMax : 11,
  modelIndex : 3,
  attackBuildUp : 500,
  materialColors : {
    skin: "#77ddaa"
  },
  attackAudio: 1,
  soundDelay: 1,
  type: EnemyType.HUMANOID
}

Enemies[1] = {
  name : "the Goblin King",
  classType : UnitClass.WARRIOR,
  level: 2,
  hpMin : 90,
  hpMax : 90,
  acMin : 9,
  acMax : 9,
  damageMin : 16,
  damageMax : 16,
  delayMin : 26,
  delayMax : 26,
  atkMin : 13,
  atkMax : 13,
  modelIndex : 3,
  attackBuildUp : 400,
  materialColors : {
    skin: "#00ddbb"
  },
  attackAudio: 1,
  soundDelay: 1,
  type: EnemyType.HUMANOID
}

Enemies[2] = {
  name : "a Skeleton",
  classType : UnitClass.WARRIOR,
  level: 2,
  hpMin : 90,
  hpMax : 90,
  acMin : 13,
  acMax : 13,
  damageMin : 15,
  damageMax : 15,
  delayMin : 27,
  delayMax : 27,
  atkMin : 12,
  atkMax : 12,
  modelIndex : 4,
  attackBuildUp : 550,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[3] = {
  name : "a Zombie",
  classType : UnitClass.WARRIOR,
  level: 3,
  hpMin : 100,
  hpMax : 100,
  acMin : 13,
  acMax : 13,
  damageMin : 27,
  damageMax : 27,
  delayMin : 43,
  delayMax : 43,
  atkMin : 8,
  atkMax : 15,
  modelIndex : 5,
  attackBuildUp : 900,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 400,
  type: EnemyType.UNDEAD
}

Enemies[4] = {
  name : "Radiation-Zombie",
  classType : UnitClass.WARRIOR,
  level: 3,
  hpMin : 120,
  hpMax : 120,
  acMin : 10,
  acMax : 10,
  damageMin : 27,
  damageMax : 27,
  delayMin : 37,
  delayMax : 37,
  atkMin : 11,
  atkMax : 11,
  modelIndex : 5,
  attackBuildUp : 900,
  materialColors : {
    skin: "#00ff00"
  },
  attackAudio: 1,
  soundDelay: 400,
  type: EnemyType.UNDEAD
}

Enemies[5] = {
  name : "a Blood Skeleton",
  classType : UnitClass.WARRIOR,
  level: 3,
  hpMin : 110,
  hpMax : 110,
  acMin : 13,
  acMax : 13,
  damageMin : 17,
  damageMax : 17,
  delayMin : 23,
  delayMax : 23,
  atkMin : 15,
  atkMax : 15,
  modelIndex : 4,
  attackBuildUp : 550,
  materialColors : {
    bone : "#550000"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[7] = {
  name : "the Blood Lord",
  classType : UnitClass.WARRIOR,
  level: 4,
  hpMin : 220,
  hpMax : 220,
  acMin : 16,
  acMax : 16,
  damageMin : 25,
  damageMax : 25,
  delayMin : 17,
  delayMax : 17,
  atkMin : 17,
  atkMax : 17,
  modelIndex : 4,
  attackBuildUp : 550,
  materialColors : {
    bone : "#552222"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[8] = {
  name : "a Ghost",
  classType : UnitClass.WARRIOR,
  level: 4,
  hpMin : 150,
  hpMax : 150,
  acMin : 16,
  acMax : 16,
  damageMin : 26,
  damageMax : 26,
  delayMin : 30,
  delayMax : 30,
  atkMin : 16,
  atkMax : 16,
  modelIndex : 7,
  attackBuildUp : 500,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}


Enemies[9] = {
  name : "a Spirit",
  classType : UnitClass.WARRIOR,
  level: 5,
  hpMin : 160,
  hpMax : 160,
  acMin : 16,
  acMax : 16,
  damageMin : 32,
  damageMax : 32,
  delayMin : 30,
  delayMax : 30,
  atkMin : 16,
  atkMax : 16,
  modelIndex : 7,
  attackBuildUp : 500,
  materialColors : {
    sheet: "#880101"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[10] = {
  name : "a Ghost-Spirit",
  classType : UnitClass.WARRIOR,
  level: 5,
  hpMin : 150,
  hpMax : 150,
  acMin : 18,
  acMax : 18,
  damageMin : 35,
  damageMax : 35,
  delayMin : 28,
  delayMax : 28,
  atkMin : 16,
  atkMax : 16,
  modelIndex : 7,
  attackBuildUp : 500,
  materialColors : {
    sheet: "#000099"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[11] = {
  name : "a Lizardman",
  classType : UnitClass.WARRIOR,
  level: 6,
  hpMin : 180,
  hpMax : 180,
  acMin : 18,
  acMax : 18,
  damageMin : 32,
  damageMax : 32,
  delayMin : 28,
  delayMax : 28,
  atkMin : 18,
  atkMax : 18,
  modelIndex : 6,
  attackBuildUp : 500,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.HUMANOID
}

Enemies[12] = {
  name : "a Lizardman Hunter",
  classType : UnitClass.WARRIOR,
  level: 6,
  hpMin : 190,
  hpMax : 190,
  acMin : 18,
  acMax : 18,
  damageMin : 31,
  damageMax : 31,
  delayMin : 27,
  delayMax : 27,
  atkMin : 18,
  atkMax : 18,
  modelIndex : 6,
  attackBuildUp : 500,
  materialColors : {
    skin: "#990088"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.HUMANOID
}

Enemies[13] = {
  name : "Sand Goblin Scout",
  classType : UnitClass.WARRIOR,
  level: 6,
  hpMin : 210,
  hpMax : 210,
  acMin : 20,
  acMax : 20,
  damageMin : 31,
  damageMax : 31,
  delayMin : 25,
  delayMax : 25,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 3,
  attackBuildUp : 500,
  materialColors : {
    skin: "#ffd080"
  },
  attackAudio: 1,
  soundDelay: 1,
  type: EnemyType.HUMANOID
}

Enemies[14] = {
  name : "Sand Goblin",
  classType : UnitClass.WARRIOR,
  level: 6,
  hpMin : 200,
  hpMax : 200,
  acMin : 20,
  acMax : 20,
  damageMin : 31,
  damageMax : 31,
  delayMin : 25,
  delayMax : 25,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 3,
  attackBuildUp : 500,
  materialColors : {
    skin: "#eedd80"
  },
  attackAudio: 1,
  soundDelay: 1,
  type: EnemyType.HUMANOID
}

Enemies[15] = {
  name : "a Sand Lizard",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 220,
  hpMax : 220,
  acMin : 21,
  acMax : 21,
  damageMin : 33,
  damageMax : 33,
  delayMin : 25,
  delayMax : 25,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 6,
  attackBuildUp : 500,
  materialColors : {
    skin: "#cc9944"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.HUMANOID
}

Enemies[16] = {
  name : "a Sand Lizard Hunter",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 230,
  hpMax : 230,
  acMin : 21,
  acMax : 21,
  damageMin : 35,
  damageMax : 35,
  delayMin : 27,
  delayMax : 27,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 6,
  attackBuildUp : 500,
  materialColors : {
    skin: "#aa6022"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.HUMANOID
}

Enemies[17] = {
  name : "a Death Goblin",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 250,
  hpMax : 250,
  acMin : 23,
  acMax : 23,
  damageMin : 36,
  damageMax : 36,
  delayMin : 26,
  delayMax : 26,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 3,
  attackBuildUp : 500,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 1,
  type: EnemyType.HUMANOID
}

Enemies[18] = {
  name : "a Death Skeleton",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 250,
  hpMax : 250,
  acMin : 23,
  acMax : 23,
  damageMin : 36,
  damageMax : 36,
  delayMin : 26,
  delayMax : 26,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 4,
  attackBuildUp : 550,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[19] = {
  name : "a Death Zombie",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 250,
  hpMax : 250,
  acMin : 23,
  acMax : 23,
  damageMin : 36,
  damageMax : 36,
  delayMin : 26,
  delayMax : 26,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 5,
  attackBuildUp : 900,
  materialColors : {},
  attackAudio: 1,
  soundDelay: 400,
  type: EnemyType.UNDEAD
}

Enemies[20] = {
  name : "a Death Skeleton",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 250,
  hpMax : 250,
  acMin : 23,
  acMax : 23,
  damageMin : 36,
  damageMax : 36,
  delayMin : 26,
  delayMax : 26,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 4,
  attackBuildUp : 550,
  materialColors : {
    bone : "#550000"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[21] = {
  name : "a Death Spirit",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 250,
  hpMax : 250,
  acMin : 23,
  acMax : 23,
  damageMin : 36,
  damageMax : 36,
  delayMin : 26,
  delayMax : 26,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 7,
  attackBuildUp : 500,
  materialColors : {
    sheet: "#880101"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.UNDEAD
}

Enemies[22] = {
  name : "a Death Lizard",
  classType : UnitClass.WARRIOR,
  level: 7,
  hpMin : 250,
  hpMax : 250,
  acMin : 23,
  acMax : 23,
  damageMin : 36,
  damageMax : 36,
  delayMin : 26,
  delayMax : 26,
  atkMin : 20,
  atkMax : 20,
  modelIndex : 6,
  attackBuildUp : 500,
  materialColors : {
    skin: "#cc9944"
  },
  attackAudio: 1,
  soundDelay: 100,
  type: EnemyType.HUMANOID
}