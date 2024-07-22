import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { UserStats } from "../../adapters/akatsuki-api/users"
import {
  formatDecimal,
  formatNumber,
  formatTimespan,
} from "../../utils/formatting"
import { getGradeColor } from "../../scores"

const ProfileGradesCard = ({ statsData }: { statsData: UserStats }) => {
  // TODO: once these are hooked up in user stats API
  const xhCount = 0
  const shCount = 0
  const xCount = 0
  const sCount = 0
  const aCount = 0

  return (
    <>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("XH")}>
            SS
          </Typography>
          <Typography variant="h5">{formatNumber(xhCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("SH")}>
            S
          </Typography>
          <Typography variant="h5">{formatNumber(shCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("X")}>
            SS
          </Typography>
          <Typography variant="h5">{formatNumber(xCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("S")}>
            S
          </Typography>
          <Typography variant="h5">{formatNumber(sCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("A")}>
            A
          </Typography>
          <Typography variant="h5">{formatNumber(aCount)}</Typography>
        </Stack>
      </Stack>
    </>
  )
}

export const ProfileStatsCard = ({ statsData }: { statsData: UserStats }) => {
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
        <ProfileGradesCard statsData={statsData} />
      </Stack>
    </Box>
  )
}
