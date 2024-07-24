import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { UserStats } from "../../adapters/akatsuki-api/users"
import { formatNumber, formatTimespan } from "../../utils/formatting"
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
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <GradeCountDisplay grade="XH" count={statsData.grades.XHCount} />
      <GradeCountDisplay grade="SH" count={statsData.grades.SHCount} />
      <GradeCountDisplay grade="X" count={statsData.grades.XCount} />
      <GradeCountDisplay grade="S" count={statsData.grades.SCount} />
      <GradeCountDisplay grade="A" count={statsData.grades.ACount} />
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
