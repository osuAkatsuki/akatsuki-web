import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { UserStats } from "../../adapters/akatsuki-api/users"
import {
  formatDecimal,
  formatNumber,
  formatTimespan,
} from "../../utils/formatting"
import {
  getGradeColor,
  remapSSForDisplay as getGradeDisplayName,
} from "../../scores"

const GradeCountDisplay = ({
  grade,
  count,
}: {
  grade: string
  count: number
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="h5" color={getGradeColor(grade)}>
        {getGradeDisplayName(grade)}
      </Typography>
      <Typography variant="h5">{formatNumber(count)}</Typography>
    </Stack>
  )
}

const ProfileGradesCard = ({ statsData }: { statsData: UserStats }) => {
  // TODO: once these are hooked up in user stats API
  const xhCount = 0
  const shCount = 0
  const xCount = 0
  const sCount = 0
  const aCount = 0

  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <GradeCountDisplay grade="XH" count={xhCount} />
      <GradeCountDisplay grade="SH" count={shCount} />
      <GradeCountDisplay grade="X" count={xCount} />
      <GradeCountDisplay grade="S" count={sCount} />
      <GradeCountDisplay grade="A" count={aCount} />
    </Stack>
  )
}

const StatDisplay = ({ name, value }: { name: string; value: string }) => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body1">{name}</Typography>
      <Typography variant="body1" textAlign="end">
        {value}
      </Typography>
    </Stack>
  )
}

export const ProfileStatsCard = ({ statsData }: { statsData: UserStats }) => {
  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <StatDisplay
          name="Ranked Score"
          value={formatNumber(statsData.rankedScore)}
        />
        <StatDisplay
          name="Total Score"
          value={formatNumber(statsData.totalScore)}
        />
        <StatDisplay
          name="Play Count"
          value={formatNumber(statsData.playcount)}
        />
        <StatDisplay
          name="Play Time"
          value={formatTimespan(statsData.playtime, 2) || "Never played"}
        />
        <StatDisplay
          name="Replays Watched"
          value={formatNumber(statsData.replaysWatched)}
        />
        <StatDisplay
          name="Total Hits"
          value={formatNumber(statsData.totalHits)}
        />
        <StatDisplay
          name="Max Combo"
          value={formatNumber(statsData.maxCombo)}
        />
        <ProfileGradesCard statsData={statsData} />
      </Stack>
    </Box>
  )
}
