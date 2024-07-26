import { LinearProgress, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { linearProgressClasses } from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"

import { formatDecimal } from "../../utils/formatting"
import { LevelDisplayPolygon } from "../images/polygons/LevelDisplay"

const LevelDisplayIcon = ({ level }: { level: number }) => {
  return (
    <Box position="relative" width="25%" height={80}>
      <Box
        position="absolute"
        zIndex={0}
        top={0}
        left={0}
        height="100%"
        width="100%"
      >
        <LevelDisplayPolygon />
      </Box>
      <Box
        display="flex"
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight="bold">
          {Math.trunc(level)}
        </Typography>
      </Box>
    </Box>
  )
}

const LevelDisplayProgress = ({ level }: { level: number }) => {
  const levelCompletionPercentage = (level - Math.trunc(level)) * 100
  return (
    <Stack direction="column" justifyContent="center" spacing={0.5} width="75%">
      <Typography variant="body1" fontWeight="lighter">
        {formatDecimal(levelCompletionPercentage)}% to level{" "}
        {Math.trunc(level) + 1}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={levelCompletionPercentage}
        sx={{
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: "rgba(58, 52, 85, 1)",
          },
          "> span": {
            background:
              "linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)",
          },
        }}
      />
    </Stack>
  )
}

export const ProfileLevelCard = ({ level }: { level: number }) => {
  return (
    <Stack direction="row" spacing={1}>
      <LevelDisplayIcon level={level} />
      <LevelDisplayProgress level={level} />
    </Stack>
  )
}
