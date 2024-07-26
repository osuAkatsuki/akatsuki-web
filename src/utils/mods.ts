export enum Mods {
  Nomod = 0,
  NoFail = 1 << 0,
  Easy = 1 << 1,
  TouchScreen = 1 << 2, //old: 'NoVideo'
  Hidden = 1 << 3,
  HardRock = 1 << 4,
  SuddenDeath = 1 << 5,
  DoubleTime = 1 << 6,
  Relax = 1 << 7,
  HalfTime = 1 << 8,
  NightCore = 1 << 9,
  Flashlight = 1 << 10,
  AutoPlay = 1 << 11,
  SpunOut = 1 << 12,
  AutoPilot = 1 << 13,
  Perfect = 1 << 14,
  Key4 = 1 << 15,
  Key5 = 1 << 16,
  Key6 = 1 << 17,
  Key7 = 1 << 18,
  Key8 = 1 << 19,
  FadeIn = 1 << 20,
  Random = 1 << 21,
  Cinema = 1 << 22,
  Target = 1 << 23,
  Key9 = 1 << 24,
  KeyCoop = 1 << 25,
  Key1 = 1 << 26,
  Key3 = 1 << 27,
  Key2 = 1 << 28,
  ScoreV2 = 1 << 29,
  Mirror = 1 << 30,
}

export const formatMods = (mods: number): string => {
  if (mods === Mods.Nomod) {
    return ""
  }

  const activeMods: string[] = []

  if (mods & Mods.NoFail) {
    activeMods.push("NF")
  }
  if (mods & Mods.Easy) {
    activeMods.push("EZ")
  }
  if (mods & Mods.TouchScreen) {
    activeMods.push("TD")
  }
  if (mods & Mods.Hidden) {
    activeMods.push("HD")
  }
  if (mods & Mods.HardRock) {
    activeMods.push("HR")
  }
  if (mods & Mods.SuddenDeath) {
    activeMods.push("SD")
  }
  if (mods & Mods.DoubleTime) {
    activeMods.push("DT")
  }
  if (mods & Mods.Relax) {
    activeMods.push("RX")
  }
  if (mods & Mods.HalfTime) {
    activeMods.push("HT")
  }
  if (mods & Mods.NightCore) {
    activeMods.push("NC")
  }
  if (mods & Mods.Flashlight) {
    activeMods.push("FL")
  }
  if (mods & Mods.AutoPlay) {
    activeMods.push("AU")
  }
  if (mods & Mods.SpunOut) {
    activeMods.push("SO")
  }
  if (mods & Mods.AutoPilot) {
    activeMods.push("AP")
  }
  if (mods & Mods.Perfect) {
    activeMods.push("PF")
  }
  if (mods & Mods.ScoreV2) {
    activeMods.push("V2")
  }
  if (mods & Mods.Mirror) {
    activeMods.push("MR")
  }

  // TODO key mods

  return activeMods.join("")
}
