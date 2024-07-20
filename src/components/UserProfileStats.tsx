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
    <Box>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Performance Points</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.pp)}pp
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Overall Accuracy</Typography>
          <Typography variant="body1" textAlign="end">
            {formatDecimal(statsData.accuracy)}%
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Ranked Score</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.rankedScore)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Total Score</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.totalScore)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Highest Combo</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.maxCombo)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Total Hits</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.totalHits)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Play Count</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.playcount)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Play Time</Typography>
          <Typography variant="body1" textAlign="end">
            {formatTimespan(statsData.playtime) || "Never played"}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Replays Watched</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.replaysWatched)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Followers</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(followers)}
          </Typography>
        </Stack>
        <UserProfileGrades statsData={statsData} />
      </Stack>
    </Box>
  )
}
