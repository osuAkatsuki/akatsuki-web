export enum Mods {
  NOMOD = 0,
  NOFAIL = 1 << 0,
  EASY = 1 << 1,
  TOUCHSCREEN = 1 << 2, //old: 'NOVIDEO'
  HIDDEN = 1 << 3,
  HARDROCK = 1 << 4,
  SUDDENDEATH = 1 << 5,
  DOUBLETIME = 1 << 6,
  RELAX = 1 << 7,
  HALFTIME = 1 << 8,
  NIGHTCORE = 1 << 9,
  FLASHLIGHT = 1 << 10,
  AUTOPLAY = 1 << 11,
  SPUNOUT = 1 << 12,
  AUTOPILOT = 1 << 13,
  PERFECT = 1 << 14,
  KEY4 = 1 << 15,
  KEY5 = 1 << 16,
  KEY6 = 1 << 17,
  KEY7 = 1 << 18,
  KEY8 = 1 << 19,
  FADEIN = 1 << 20,
  RANDOM = 1 << 21,
  CINEMA = 1 << 22,
  TARGET = 1 << 23,
  KEY9 = 1 << 24,
  KEYCOOP = 1 << 25,
  KEY1 = 1 << 26,
  KEY3 = 1 << 27,
  KEY2 = 1 << 28,
  SCOREV2 = 1 << 29,
  MIRROR = 1 << 30,
}

export const formatMods = (mods: number): string => {
  if (mods === Mods.NOMOD) {
    return ""
  }

  let activeMods: string[] = []

  if (mods & Mods.NOFAIL) {
    activeMods.push("NF")
  }
  if (mods & Mods.EASY) {
    activeMods.push("EZ")
  }
  if (mods & Mods.TOUCHSCREEN) {
    activeMods.push("TD")
  }
  if (mods & Mods.HIDDEN) {
    activeMods.push("HD")
  }
  if (mods & Mods.HARDROCK) {
    activeMods.push("HR")
  }
  if (mods & Mods.SUDDENDEATH) {
    activeMods.push("SD")
  }
  if (mods & Mods.DOUBLETIME) {
    activeMods.push("DT")
  }
  if (mods & Mods.RELAX) {
    activeMods.push("RX")
  }
  if (mods & Mods.HALFTIME) {
    activeMods.push("HT")
  }
  if (mods & Mods.NIGHTCORE) {
    activeMods.push("NC")
  }
  if (mods & Mods.FLASHLIGHT) {
    activeMods.push("FL")
  }
  if (mods & Mods.AUTOPLAY) {
    activeMods.push("AU")
  }
  if (mods & Mods.SPUNOUT) {
    activeMods.push("SO")
  }
  if (mods & Mods.AUTOPILOT) {
    activeMods.push("AP")
  }
  if (mods & Mods.PERFECT) {
    activeMods.push("PF")
  }
  if (mods & Mods.SCOREV2) {
    activeMods.push("V2")
  }
  if (mods & Mods.MIRROR) {
    activeMods.push("MR")
  }

  // TODO key mods

  return activeMods.join("")
}
