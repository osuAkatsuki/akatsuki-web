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
  Stack,
  Grid,
  Divider,
} from "@mui/material"
import moment from "moment"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../scores"
import { formatDecimal, formatNumber } from "../utils/formatting"
import { formatMods } from "../utils/mods"
import { useEffect, useState } from "react"
import { GameMode, RelaxMode } from "../gameModes"

const UserScoreCard = (userScore: UserScore) => {
  const scoreGrade =
    calculateGrade(
      userScore.playMode,
      userScore.mods,
      userScore.accuracy,
      userScore.count300,
      userScore.count100,
      userScore.count50,
      userScore.countMiss
    ) ?? "F"

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        padding={1}
        justifyContent="space-between"
      >
        <Box
          minWidth={50}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">{remapSSForDisplay(scoreGrade)}</Typography>
        </Box>
        <Box position="relative" overflow="hidden" flexGrow={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            position="relative"
            zIndex={1}
          >
            {/* Left menu */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Divider orientation="vertical" />
              {/* TODO: split artist, song name & difficulty for separate display */}
              <Typography variant="body2">
                {userScore.beatmap.songName}
              </Typography>
            </Stack>
            {/* Right menu */}
            <Stack direction="column">
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="h6" fontWeight="bold">
                  {Math.round(userScore.pp)}pp
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" fontWeight="lighter">
                  {formatNumber(userScore.score)}
                </Typography>
                <Typography variant="body2">
                  {formatDecimal(userScore.accuracy)}%
                </Typography>
              </Stack>
              {/* TODO: add replay download option */}
            </Stack>
          </Stack>
          {/* Background Image */}
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            zIndex={0}
            sx={{
              backgroundImage: `url(https://assets.ppy.sh/beatmaps/${userScore.beatmap.beatmapsetId}/covers/cover.jpg)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              // backgroundBlendMode: "multiply",
              filter: "blur(3px) brightness(0.5)",
            }}
          ></Box>
        </Box>
      </Stack>
    </>
  )
}

export const UserProfileScores = ({
  scoresType,
  userId,
  gameMode,
  relaxMode,
  title,
}: {
  scoresType: "best" | "recent" | "pinned"
  userId: number
  gameMode: GameMode
  relaxMode: RelaxMode
  title: string
}) => {
  const [userScores, setUserScores] = useState<UserScoresResponse | null>(null)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)

  const [error, setError] = useState("")

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      try {
        const userScores = await fetchUserScores({
          type: scoresType,
          mode: gameMode,
          p: page + 1,
          l: pageSize,
          rx: relaxMode,
          id: userId,
        })
        setUserScores(userScores)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch user scores data from server")
        return
      }
    })()
  }, [scoresType, userId, gameMode, relaxMode, page, pageSize])

  if (error) {
    return <Typography>{error}</Typography>
  }

  // TODO: show a friendly null state here
  // if (!userScores?.scores || userScores.scores.length === 0) {
  //   return <></>
  // }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ pb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1} sx={{ pb: 1 }}>
        {userScores?.scores?.map((score: UserScore) => (
          <Paper elevation={1}>
            <UserScoreCard {...score} />
          </Paper>
        ))}
      </Stack>

      {/* <TablePagination
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
      /> */}
    </Box>
  )
}
