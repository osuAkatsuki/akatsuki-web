export enum ServerGameMode {
  VanillaStandard = 0,
  VanillaTaiko = 1,
  VanillaCatch = 2,
  VanillaMania = 3,
  RelaxStandard = 4,
  RelaxTaiko = 5,
  RelaxCatch = 6,
  // RelaxMania = 7,  // doesn't exist
  AutoStandard = 8,
  // AutoTaiko = 9,   // doesn't exist
  // AutoCatch = 10,  // doesn't exist
  // AutoMania = 11,  // doesn't exist
}

export enum ClientGameMode {
  Standard = 0,
  Taiko = 1,
  Catch = 2,
  Mania = 3,
}

// (the concept of "relax mode" only exists on the frontend)
export enum RelaxMode {
  // TODO: should this be ccombined with GameMode on the FE?
  Vanilla = 0,
  Relax = 1,
  Autopilot = 2,
}

export const toClientGameMode = (serverGameMode: ServerGameMode): ClientGameMode => {
  if (serverGameMode === ServerGameMode.AutoStandard) {
    return ClientGameMode.Standard;
  } else if (serverGameMode >= ServerGameMode.RelaxStandard) {
    return serverGameMode - ServerGameMode.RelaxStandard;
  } else {
    return serverGameMode as unknown as ClientGameMode;
  }
};

export const toServerGameModeFromClientModeAndMods = (
  clientGameMode: ClientGameMode,
  mods: number
): ServerGameMode => {
  let gameMode = clientGameMode as unknown as ServerGameMode;
  if (mods & 128) {
    // relax
    gameMode += 4;
  }
  if (mods & 8192) {
    // autopilot
    gameMode += 8;
  }
  return gameMode;
};

export const toServerModeFromClientAndRelaxModes = (
  clientGameMode: ClientGameMode,
  relaxMode: RelaxMode
): ServerGameMode => {
  let gameMode = clientGameMode as unknown as ServerGameMode;
  if (relaxMode === RelaxMode.Relax) {
    gameMode += 4;
  } else if (relaxMode === RelaxMode.Autopilot) {
    gameMode += 8;
  }
  return gameMode;
};

export const isRealGameMode = (gameMode: ClientGameMode, relaxMode: RelaxMode) => {
  if (relaxMode === RelaxMode.Vanilla) {
    // all game modes are allowed for vanilla
    return true;
  } else if (relaxMode === RelaxMode.Relax) {
    // only standard, taiko, and catch are allowed for relax
    return (
      gameMode === ClientGameMode.Standard ||
      gameMode === ClientGameMode.Taiko ||
      gameMode === ClientGameMode.Catch
    );
  } else {
    // (relaxMode === RelaxMode.Autopilot) {
    // only standard is allowed for autopilot
    return gameMode === ClientGameMode.Standard;
  }
};
