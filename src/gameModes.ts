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
