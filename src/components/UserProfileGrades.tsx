import { Stack, Typography } from "@mui/material"
import { formatNumber } from "../utils/formatting"
import { getGradeColor } from "../scores"
import { UserStats } from "../adapters/akatsuki-api/users"

export const UserProfileGrades = ({ statsData }: { statsData: UserStats }) => {
  // TODO: once these are hooked up in user stats API
  const xhCount = 0
  const shCount = 0
  const xCount = 0
  const sCount = 0
  const aCount = 0

  return (
    <>
      <Stack direction="row" justifyContent="space-evenly" spacing={1}>
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
