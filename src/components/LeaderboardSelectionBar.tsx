import { Button, Stack } from "@mui/material"
import { GameMode, RelaxMode, isRealGameMode } from "../gameModes"

export const LeaderboardSelectionBar = ({
  gameMode,
  relaxMode,
  country,
  sortParam,
  setGameMode,
  setRelaxMode,
  setCountry,
  setSortParam,
}: {
  gameMode: GameMode
  relaxMode: RelaxMode
  country: string
  sortParam: string
  setGameMode: (gameMode: GameMode) => void
  setRelaxMode: (relaxMode: RelaxMode) => void
  setCountry: (country: string) => void
  setSortParam: (sortParam: string) => void
}): JSX.Element => {
  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={1}
      >
        <Stack direction="row" spacing={1}>
          <Button
            variant={gameMode === GameMode.Standard ? "contained" : "outlined"}
            disabled={!isRealGameMode(GameMode.Standard, relaxMode)}
            onClick={() => setGameMode(GameMode.Standard)}
          >
            osu!
          </Button>
          <Button
            variant={gameMode === GameMode.Taiko ? "contained" : "outlined"}
            disabled={!isRealGameMode(GameMode.Taiko, relaxMode)}
            onClick={() => setGameMode(GameMode.Taiko)}
          >
            Taiko
          </Button>
          <Button
            variant={gameMode === GameMode.Catch ? "contained" : "outlined"}
            disabled={!isRealGameMode(GameMode.Catch, relaxMode)}
            onClick={() => setGameMode(GameMode.Catch)}
          >
            Catch
          </Button>
          <Button
            variant={gameMode === GameMode.Mania ? "contained" : "outlined"}
            disabled={!isRealGameMode(GameMode.Mania, relaxMode)}
            onClick={() => setGameMode(GameMode.Mania)}
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
            variant={
              relaxMode === RelaxMode.Autopilot ? "contained" : "outlined"
            }
            disabled={!isRealGameMode(gameMode, RelaxMode.Autopilot)}
            onClick={() => setRelaxMode(RelaxMode.Autopilot)}
          >
            Autopilot
          </Button>
        </Stack>
        {/* TODO: country and sort param selection */}
      </Stack>
    </>
  )
}
