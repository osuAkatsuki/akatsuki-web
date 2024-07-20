import {
  fetchUserScores,
  UserScoresResponse,
  type UserScore,
} from "../adapters/akatsuki-api/userScores"
import { Link } from "react-router-dom"
import {
  Paper,
  Box,
  Typography,
  Stack,
  IconButton,
  TablePagination,
} from "@mui/material"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../scores"
import { formatDecimal, formatNumber } from "../utils/formatting"
import { formatMods } from "../utils/mods"
import { useEffect, useState } from "react"
import { GameMode, RelaxMode } from "../gameModes"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"

const SONG_NAME_REGEX =
  /^(?<artist>[^-]+) - (?<songName>[^[]+) \[(?<version>.+)\]$/

const SCORE_PP_DISPLAY_GRADIENT =
  "linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(79.96deg, #387EFC 16.72%, #C940FD 91.26%), #FFFFFF"

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

  const { artist, songName, version } = userScore.beatmap.songName.match(
    SONG_NAME_REGEX
  )?.groups ?? {
    artist: "Unknown",
    song: "Unknown",
    version: "Unknown",
  }
  return (
    <Stack direction="row" justifyContent="space-between">
      <Box
        minWidth={75}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={getGradeColor(scoreGrade)}
      >
        <Typography variant="h5" fontWeight="bold" color="#111111">
          {remapSSForDisplay(scoreGrade)}
        </Typography>
      </Box>
      <Box position="relative" overflow="hidden" flexGrow={1}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent={{ sm: "space-between" }}
          position="relative"
          zIndex={1}
          p={1}
        >
          {/* Left menu */}
          <Stack direction="column">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ sm: 1 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="h6">{songName}</Typography>
              <Typography variant="body1" fontWeight="lighter">
                by {artist}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2">{version}</Typography>
              {userScore.mods ? (
                <Typography variant="body2">
                  +{formatMods(userScore.mods)}
                </Typography>
              ) : null}
            </Stack>
            {/* TODO: Add date played/timeago */}
          </Stack>
          {/* Right menu */}
          <Stack direction={{ xs: "column", sm: "row" }}>
            <Stack direction="column">
              <Box
                display="flex"
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    background: SCORE_PP_DISPLAY_GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
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
            </Stack>
            {/* TODO: add replay download option */}
            <Box display="flex" alignItems="center">
              <Link to={`https://akatsuki.gg/web/replays/${userScore.id}`}>
                <IconButton aria-label="support">
                  <DownloadForOfflineIcon />
                </IconButton>
              </Link>
            </Box>
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
            backgroundImage: `
                linear-gradient(90deg, ${getGradeColor(scoreGrade, 0.2)}, ${getGradeColor(scoreGrade, 0.0)} 48.5%),
                linear-gradient(0deg, rgba(22, 19, 35, 0.9), rgba(22, 19, 35, 0.9)),
                url(https://assets.ppy.sh/beatmaps/${userScore.beatmap.beatmapsetId}/covers/cover.jpg)
              `,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>
      </Box>
    </Stack>
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
  const [pageSize, setPageSize] = useState(10)

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
          <Box key={score.id} borderRadius="16px" overflow="hidden">
            <Paper elevation={1}>
              <UserScoreCard {...score} />
            </Paper>
          </Box>
        ))}
      </Stack>

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
  )
}
