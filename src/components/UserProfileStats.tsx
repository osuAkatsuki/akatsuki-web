import { type UserStats } from "../adapters/akatsuki-api/users"

import { Box, Typography, Stack } from "@mui/material"
import {
  formatDecimal,
  formatNumber,
  formatTimespan,
} from "../utils/formatting"

import { UserProfileGrades } from "./UserProfileGrades"

export const UserProfileStats = ({
  statsData,
  followers,
}: {
  statsData: UserStats
  followers: number
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ pb: 1 }}>
        Gameplay Stats
      </Typography>
      <Stack direction="column" spacing={1}>
        <Stack direction="row">
          <Typography width="50%">Performance Points</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.pp)}pp
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Overall Accuracy</Typography>
          <Typography width="50%" textAlign="end">
            {formatDecimal(statsData.accuracy)}%
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Ranked Score</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.rankedScore)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Total Score</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.totalScore)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Highest Combo</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.maxCombo)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Total Hits</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.totalHits)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Play Count</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.playcount)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Play Time</Typography>
          <Typography width="50%" textAlign="end">
            {formatTimespan(statsData.playtime) || "Never played"}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Replays Watched</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(statsData.replaysWatched)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography width="50%">Followers</Typography>
          <Typography width="50%" textAlign="end">
            {formatNumber(followers)}
          </Typography>
        </Stack>
        <Box sx={{ pt: 1 }}></Box>
        <UserProfileGrades statsData={statsData} />
      </Stack>
    </Box>
  )
}
