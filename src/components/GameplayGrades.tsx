import { Stack, Typography } from "@mui/material";
import { Stats } from "../interfaces/stats";
import { formatNumber } from "../utils/formatting";
import { getGradeColor } from "../scores";

export const GameplayGrades = ({ statsData }: { statsData: Stats }) => {
  return (
    <>
      <Stack direction="row" justifyContent="space-evenly" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("XH")}>
            SS
          </Typography>
          <Typography variant="h5">{formatNumber(statsData.xhCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("SH")}>
            S
          </Typography>
          <Typography variant="h5">{formatNumber(statsData.shCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("X")}>
            SS
          </Typography>
          <Typography variant="h5">{formatNumber(statsData.xCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("S")}>
            S
          </Typography>
          <Typography variant="h5">{formatNumber(statsData.sCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("A")}>
            A
          </Typography>
          <Typography variant="h5">{formatNumber(statsData.aCount)}</Typography>
        </Stack>
      </Stack>
    </>
  );
};
