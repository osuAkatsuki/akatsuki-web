import { type UserStats } from "../adapters/akatsuki-api/users"

import { Box, Paper, Typography, Stack } from "@mui/material"
import {
  formatDecimal,
  formatNumber,
  formatTimespan,
} from "../utils/formatting"

import { UserProfileGrades } from "./UserProfileGrades"

export const UserProfileStats = ({ statsData }: { statsData: UserStats }) => {
  return (
    <Paper elevation={3}>
      {/* Overall Stats */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ pb: 1 }}>
          Gameplay Stats
        </Typography>
        <Stack direction="column" spacing={1}>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Performance Points</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatNumber(statsData.pp)}pp
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Overall Accuracy</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatDecimal(statsData.accuracy)}%
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Ranked Score</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatNumber(statsData.rankedScore)}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Total Score</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatNumber(statsData.totalScore)}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Highest Combo</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatNumber(statsData.maxCombo)}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Total Hits</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatNumber(statsData.totalHits)}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Play Count</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatNumber(statsData.playcount)}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography sx={{ width: 1 / 2 }}>Play Time</Typography>
            <Typography sx={{ width: 1 / 2, textAlign: "end" }}>
              {formatTimespan(statsData.playtime) || "Never played"}
            </Typography>
          </Stack>
          <Box sx={{ pt: 1 }}></Box>
          <UserProfileGrades statsData={statsData} />
        </Stack>
      </Box>
    </Paper>
  )
}
