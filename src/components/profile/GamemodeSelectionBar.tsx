// TODO: reuse this component across the profile & leaderboard pages

import Stack from "@mui/material/Stack"
import { GameMode, RelaxMode } from "../../gameModes"
import { GameModeSelector, RelaxModeSelector } from "../GameModeSelector"
import { StandardGameModeIcon } from "../images/gamemode-icons/StandardGameModeIcon"
import { TaikoGameModeIcon } from "../images/gamemode-icons/TaikoGameModeIcon"
import { CatchGameModeIcon } from "../images/gamemode-icons/CatchGameModeIcon"
import { ManiaGameModeIcon } from "../images/gamemode-icons/ManiaGameModeIcon"

export const GamemodeSelectionBar = ({
  gameMode,
  setGameMode,
  relaxMode,
  setRelaxMode,
}: {
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
  relaxMode: RelaxMode
  setRelaxMode: (mode: RelaxMode) => void
}) => {
  return (
    <Stack
      px={3}
      py={2}
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "center" }}
    >
      <Stack direction="row" gap={3}>
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Standard}
          setGameMode={setGameMode}
          icon={<StandardGameModeIcon />}
        />
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Taiko}
          setGameMode={setGameMode}
          icon={<TaikoGameModeIcon />}
        />
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Catch}
          setGameMode={setGameMode}
          icon={<CatchGameModeIcon />}
        />
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Mania}
          setGameMode={setGameMode}
          icon={<ManiaGameModeIcon />}
        />
      </Stack>

      <Stack direction="row" gap={3}>
        <RelaxModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetRelaxMode={RelaxMode.Vanilla}
          setRelaxMode={setRelaxMode}
        />
        <RelaxModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetRelaxMode={RelaxMode.Relax}
          setRelaxMode={setRelaxMode}
        />
        <RelaxModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetRelaxMode={RelaxMode.Autopilot}
          setRelaxMode={setRelaxMode}
        />
      </Stack>
    </Stack>
  )
}
