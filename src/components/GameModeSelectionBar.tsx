import { Button, Stack } from "@mui/material";
import { ClientGameMode, RelaxMode, isRealGameMode } from "../gameModes";

export const GameModeSelectionBar = ({
  gameMode,
  relaxMode,
  setGameMode,
  setRelaxMode,
}: {
  gameMode: ClientGameMode;
  relaxMode: RelaxMode;
  setGameMode: (gameMode: ClientGameMode) => void;
  setRelaxMode: (relaxMode: RelaxMode) => void;
}): JSX.Element => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Button
            variant={gameMode === ClientGameMode.Standard ? "contained" : "outlined"}
            disabled={!isRealGameMode(ClientGameMode.Standard, relaxMode)}
            onClick={() => setGameMode(ClientGameMode.Standard)}
          >
            Standard
          </Button>
          <Button
            variant={gameMode === ClientGameMode.Taiko ? "contained" : "outlined"}
            disabled={!isRealGameMode(ClientGameMode.Taiko, relaxMode)}
            onClick={() => setGameMode(ClientGameMode.Taiko)}
          >
            Taiko
          </Button>
          <Button
            variant={gameMode === ClientGameMode.Catch ? "contained" : "outlined"}
            disabled={!isRealGameMode(ClientGameMode.Catch, relaxMode)}
            onClick={() => setGameMode(ClientGameMode.Catch)}
          >
            Catch The Beat
          </Button>
          <Button
            variant={gameMode === ClientGameMode.Mania ? "contained" : "outlined"}
            disabled={!isRealGameMode(ClientGameMode.Mania, relaxMode)}
            onClick={() => setGameMode(ClientGameMode.Mania)}
          >
            Mania
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant={relaxMode === RelaxMode.Vanilla ? "contained" : "outlined"}
            disabled={!isRealGameMode(gameMode, RelaxMode.Vanilla)}
            onClick={() => setRelaxMode(RelaxMode.Vanilla)}
          >
            Vanilla
          </Button>
          <Button
            variant={relaxMode === RelaxMode.Relax ? "contained" : "outlined"}
            disabled={!isRealGameMode(gameMode, RelaxMode.Relax)}
            onClick={() => setRelaxMode(RelaxMode.Relax)}
          >
            Relax
          </Button>
          <Button
            variant={relaxMode === RelaxMode.Autopilot ? "contained" : "outlined"}
            disabled={!isRealGameMode(gameMode, RelaxMode.Autopilot)}
            onClick={() => setRelaxMode(RelaxMode.Autopilot)}
          >
            Autopilot
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
