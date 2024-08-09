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

enum ModAbbreviations {
  Nomod = "" as any,
  NoFail = "NF" as any,
  Easy = "EZ" as any,
  TouchScreen = "TD" as any,
  Hidden = "HD" as any,
  HardRock = "HR" as any,
  SuddenDeath = "SD" as any,
  DoubleTime = "DT" as any,
  Relax = "RX" as any,
  HalfTime = "HT" as any,
  NightCore = "NC" as any,
  Flashlight = "FL" as any,
  AutoPlay = "AU" as any,
  SpunOut = "SO" as any,
  AutoPilot = "AP" as any,
  Perfect = "PF" as any,
  Key4 = "4K" as any,
  Key5 = "5K" as any,
  Key6 = "6K" as any,
  Key7 = "7K" as any,
  Key8 = "8K" as any,
  FadeIn = "FI" as any,
  Random = "RN" as any,
  Cinema = "CN" as any,
  Target = "TP" as any,
  Key9 = "9K" as any,
  KeyCoop = "DS" as any, // dual stages
  Key1 = "1K" as any,
  Key3 = "3K" as any,
  Key2 = "2K" as any,
  ScoreV2 = "V2" as any,
  Mirror = "MR" as any,
}

enum HumanReadable {
  Nomod = "" as any,
  NoFail = "No Fail" as any,
  Easy = "Easy" as any,
  TouchScreen = "Touch Device" as any,
  Hidden = "Hidden" as any,
  HardRock = "Hard Rock" as any,
  SuddenDeath = "Sudden Death" as any,
  DoubleTime = "Double Time" as any,
  Relax = "Relax" as any,
  HalfTime = "Half Time" as any,
  NightCore = "Nightcore" as any,
  Flashlight = "Flashlight" as any,
  AutoPlay = "Auto" as any,
  SpunOut = "Spun Out" as any,
  AutoPilot = "Autopilot" as any,
  Perfect = "Perfect" as any,
  Key4 = "4 Keys" as any,
  Key5 = "5 Keys" as any,
  Key6 = "6 Keys" as any,
  Key7 = "7 Keys" as any,
  Key8 = "8 Keys" as any,
  FadeIn = "Fade In" as any,
  Random = "Random" as any,
  Cinema = "Cinema" as any,
  Target = "Target Practice" as any,
  Key9 = "9 Keys" as any,
  KeyCoop = "Dual Stages" as any,
  Key1 = "1 Key" as any,
  Key3 = "3 Keys" as any,
  Key2 = "2 Keys" as any,
  ScoreV2 = "Score V2" as any,
  Mirror = "Mirror" as any,
}

export const getIndividualMods = (mods: number): Mods[] => {
  return Object.values(Mods)
    .filter((x) => typeof x !== "string")
    .map((mod) => mod as Mods)
    .filter((mod) => mods & mod)
}

export const formatMods = (mods: number): string => {
  const activeMods: string[] = getIndividualMods(mods).map(
    (mod) => ModAbbreviations[Mods[mod] as any]
  )

  return activeMods.join("")
}

export const getHumanReadable = (mod: Mods): string =>
  HumanReadable[Mods[mod] as any]
