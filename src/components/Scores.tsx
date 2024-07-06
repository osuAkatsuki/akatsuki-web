import {
  Paper,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import type { Score } from "../interfaces/scores";
import { getGradeColor } from "../scores";
import { formatDecimal, formatNumber } from "../utils/formatting";
import { formatMods } from "../utils/mods";

export const Scores = ({ title, scoresData }: { title: string; scoresData: Score[] }) => {
  return (
    <Paper elevation={3}>
      {/* Best Scores */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ pb: 1 }}>
          {title}
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="scores table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Grade</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Beatmap</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Performance</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Accuracy</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Combo</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Score</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Submitted At</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoresData.map((score: Score) => (
                <TableRow>
                  {/* TODO: images for the grades */}
                  <TableCell align="center">
                    <Typography variant="h5" color={getGradeColor(score.grade)} noWrap={true}>
                      {score.grade}
                    </Typography>
                  </TableCell>
                  {/* TODO: full beatmap name & diffname */}
                  {/* TODO: clickable to go to beatmap page */}
                  <TableCell>
                    <Typography variant="subtitle2">
                      {score.beatmapArtist} - {score.beatmapTitle} [{score.beatmapVersion}]{" "}
                      {score.mods ? `+${formatMods(score.mods)}` : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap={true}>
                      {formatDecimal(score.performancePoints)}pp
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap={true}>{formatDecimal(score.accuracy)}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap={true}>{formatNumber(score.highestCombo)}x</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap={true}>{formatNumber(score.score)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap={true}>{score.createdAt.toLocaleString("en-US")}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};
