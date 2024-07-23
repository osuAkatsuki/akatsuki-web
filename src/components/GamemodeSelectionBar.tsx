import Box from "@mui/material/Box"
import { GameMode, isRealGameMode, RelaxMode } from "../gameModes"
import Typography from "@mui/material/Typography"
import { Stack } from "@mui/material"
import { StandardGameModeIcon } from "./images/gamemode-icons/StandardGameModeIcon"
import { ManiaGameModeIcon } from "./images/gamemode-icons/ManiaGameModeIcon"
import { CatchGameModeIcon } from "./images/gamemode-icons/CatchGameModeIcon"
import { TaikoGameModeIcon } from "./images/gamemode-icons/TaikoGameModeIcon"

const GameModeSelector = ({
  currentGameMode,
  currentRelaxMode,
  targetGameMode,
  setGameMode,
  icon,
}: {
  currentGameMode: GameMode
  currentRelaxMode: RelaxMode
  targetGameMode: GameMode
  setGameMode: (mode: GameMode) => void
  icon: JSX.Element
}) => {
  const isSelected = currentGameMode === targetGameMode
  const isRealMode = isRealGameMode(targetGameMode, currentRelaxMode)
  return (
    <Box
      height={25}
      width={25}
      onClick={() => {
        if (isRealMode) setGameMode(targetGameMode)
      }}
      sx={[
        {
          "&": {
            color: isSelected
              ? "white"
              : isRealMode
                ? null
                : "hsl(0deg 0% 100% / 20%)",
          },
        },
        {
          "&:hover": {
            cursor: isRealMode ? "pointer" : "not-allowed",
            color: isRealMode ? "hsl(0deg 0% 100% / 80%)" : null,
          },
        },
      ]}
    >
      {icon}
    </Box>
  )
}

const RelaxModeSelector = ({
  currentGameMode,
  currentRelaxMode,
  targetRelaxMode,
  setRelaxMode,
}: {
  currentGameMode: GameMode
  currentRelaxMode: RelaxMode
  targetRelaxMode: RelaxMode
  setRelaxMode: (mode: RelaxMode) => void
}) => {
  const isSelected = currentRelaxMode === targetRelaxMode
  const isRealMode = isRealGameMode(currentGameMode, targetRelaxMode)
  return (
    <Box
      onClick={() => {
        if (isRealMode) setRelaxMode(targetRelaxMode)
      }}
      sx={[
        {
          "&:hover": {
            cursor: isRealMode ? "pointer" : "not-allowed",
            color: isRealMode ? "hsl(0deg 0% 100% / 80%)" : null,
          },
        },
      ]}
    >
      <Typography
        fontSize={17}
        sx={{
          color: isSelected
            ? "white"
            : isRealMode
              ? null
              : "hsl(0deg 0% 100% / 20%)",
          fontWeight: isSelected ? 700 : 200,
        }}
      >
        {RelaxMode[targetRelaxMode].toLowerCase()}
      </Typography>
    </Box>
  )
}

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
      spacing={1}
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
