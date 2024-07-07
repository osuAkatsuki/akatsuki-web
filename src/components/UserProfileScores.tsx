import {
  fetchUserScores,
  UserScoresResponse,
  type UserScore,
} from "../adapters/akatsuki-api/userScores"
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
  TablePagination,
} from "@mui/material"
import moment from "moment"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../scores"
import { formatDecimal, formatNumber } from "../utils/formatting"
import { formatMods } from "../utils/mods"
import { useEffect, useState } from "react"
import { GameMode, RelaxMode } from "../gameModes"

export const UserProfileScores = ({
  scoresType,
  userId,
  gameMode,
  relaxMode,
  title,
}: {
  scoresType: "best" | "recent"
  userId: number
  gameMode: GameMode
  relaxMode: RelaxMode
  title: string
}) => {
  const [userScoresResponse, setScores] = useState<UserScoresResponse | null>(
    null
  )

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)

  const [error, setError] = useState("")

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      try {
        const playerBestScores = await fetchUserScores({
          type: scoresType,
          mode: gameMode,
          p: page + 1,
          l: pageSize,
          rx: relaxMode,
          id: userId,
        })
        setScores(playerBestScores)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch best scores data from server")
        return
      }
    })()
  }, [scoresType, userId, gameMode, relaxMode, page, pageSize])

  if (error) {
    return <Typography>{error}</Typography>
  }

  return (
    <Paper elevation={3}>
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
              {userScoresResponse?.scores?.map((score: UserScore) => (
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
        <TablePagination
          component={Paper}
          count={-1}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10))
            setPage(0)
          }}
          labelDisplayedRows={({ from, to, count }) => {
            return `Results ${from}-${to}`
          }}
        />
      </Box>
    </Paper>
  )
}
