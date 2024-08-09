import { Mods } from "./utils/mods"

// Score offsets for relax & autopilot scores
const RELAX_SCORE_ID_OFFSET = 500_000_000n
const AUTOPILOT_SCORE_ID_OFFSET = 6_148_914_691_236_517_204n

export enum GameMode {
  Standard = 0,
  Taiko = 1,
  Catch = 2,
  Mania = 3,
}

export enum RelaxMode {
  Vanilla = 0,
  Relax = 1,
  Autopilot = 2,
}

export const isRealGameMode = (gameMode: GameMode, relaxMode: RelaxMode) => {
  if (relaxMode === RelaxMode.Vanilla) {
    // all game modes are allowed for vanilla
    return true
  } else if (relaxMode === RelaxMode.Relax) {
    // only standard, taiko, and catch are allowed for relax
    return (
      gameMode === GameMode.Standard ||
      gameMode === GameMode.Taiko ||
      gameMode === GameMode.Catch
    )
  } else {
    // (relaxMode === RelaxMode.Autopilot) {
    // only standard is allowed for autopilot
    return gameMode === GameMode.Standard
  }
}

export const getRelaxModeFromMods = (mods: number) => {
  if (mods & Mods.AutoPilot) {
    return RelaxMode.Autopilot
  } else if (mods & Mods.Relax) {
    return RelaxMode.Relax
  } else {
    return RelaxMode.Vanilla
  }
}

export const getRelaxModeFromOffset = (scoreId: bigint) => {
  if (scoreId < RELAX_SCORE_ID_OFFSET) {
    return RelaxMode.Relax
  } else if (scoreId >= AUTOPILOT_SCORE_ID_OFFSET) {
    return RelaxMode.Autopilot
  } else {
    return RelaxMode.Vanilla
  }
}
