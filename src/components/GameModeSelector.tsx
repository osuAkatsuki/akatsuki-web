import Box from "@mui/material/Box"
import { GameMode, isRealGameMode, RelaxMode } from "../gameModes"
import Typography from "@mui/material/Typography"

export const GameModeSelector = ({
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

export const RelaxModeSelector = ({
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
