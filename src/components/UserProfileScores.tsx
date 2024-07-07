import { type UserScore } from "../adapters/akatsuki-api/userScores"
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
  Tooltip,
} from "@mui/material"
import moment from "moment"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../scores"
import { formatDecimal, formatNumber } from "../utils/formatting"
import { formatMods } from "../utils/mods"

export const UserProfileScores = ({
  scoresData,
  title,
}: {
  scoresData: UserScore[]
  title: string
}) => {
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
                <TableCell align="center">
                  <Typography>Grade</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography>Beatmap</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>Performance</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>Accuracy</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>Combo</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>Score</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>Submitted</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoresData.map((score: UserScore) => (
                <TableRow>
                  {/* TODO: images for the grades */}
                  <TableCell align="center">
                    <Typography
                      variant="h5"
                      color={getGradeColor(
                        calculateGrade(
                          score.playMode,
                          score.mods,
                          score.accuracy,
                          score.count300,
                          score.count100,
                          score.count50,
                          score.countMiss
                        ) ?? "F"
                      )}
                      noWrap={true}
                    >
                      {remapSSForDisplay(
                        calculateGrade(
                          score.playMode,
                          score.mods,
                          score.accuracy,
                          score.count300,
                          score.count100,
                          score.count50,
                          score.countMiss
                        )
                      ) ?? "F"}
                    </Typography>
                  </TableCell>
                  {/* TODO: full beatmap name & diffname */}
                  {/* TODO: clickable to go to beatmap page */}
                  <TableCell align="left">
                    <Typography variant="subtitle2">
                      {score.beatmap.songName}{" "}
                      {score.mods ? `+${formatMods(score.mods)}` : ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={`${score.pp}pp`}>
                      <Typography noWrap={true}>
                        {Math.round(score.pp)}pp
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap={true}>
                      {formatDecimal(score.accuracy)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap={true}>
                      {formatNumber(score.maxCombo)}x
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap={true}>
                      {formatNumber(score.score)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap={true}>
                      {moment(score.time).fromNow()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  )
}
