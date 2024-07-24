import { Link } from "react-router-dom"
import { Typography, IconButton, Paper, TablePagination } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { GameMode, getRelaxModeFromMods, RelaxMode } from "../../gameModes"
import { formatDecimal, formatNumber } from "../../utils/formatting"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../../scores"
import {
  fetchUserScores,
  pinUnpinUserScore,
  UserScore,
  UserScoresResponse,
} from "../../adapters/akatsuki-api/userScores"
import { formatMods } from "../../utils/mods"
import MoreVertIcon from "@mui/icons-material/MoreVert"

import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useIdentityContext } from "../../context/identity"

const SONG_NAME_REGEX =
  /^(?<artist>[^-]+) - (?<songName>[^[]+) \[(?<version>.+)\]$/

const DownloadReplayMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: UserScore
  handleMenuClose: () => void
}) => {
  return (
    <MenuItem key="download-replay" onClick={() => handleMenuClose()}>
      <Link
        to={`https://akatsuki.gg/web/replays/${score.id}`}
        style={{
          color: "#FFFFFF",
          textDecoration: "none",
        }}
      >
        Download Replay
      </Link>
    </MenuItem>
  )
}

const PinUnpinScoreMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: UserScore
  handleMenuClose: () => void
}) => {
  const { identity } = useIdentityContext()

  if (identity?.userId !== score.userId) {
    return null
  }

  return (
    <MenuItem
      key="pin-unpin-score"
      onClick={() => {
        pinUnpinUserScore({
          id: parseInt(score.id),
          rx: getRelaxModeFromMods(score.mods),
          shouldPin: !score.pinned,
        })
        handleMenuClose()
      }}
    >
      {score.pinned ? "Unpin" : "Pin"} Score
    </MenuItem>
  )
}

const ScoreOptionsMenu = ({ score }: { score: UserScore }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <DownloadReplayMenuItem score={score} handleMenuClose={handleClose} />
        <PinUnpinScoreMenuItem score={score} handleMenuClose={handleClose} />
      </Menu>
    </>
  )
}

const ProfileScoreCard = (userScore: UserScore) => {
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
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
    >
      <Box
        minWidth={{ sm: 75 }}
        minHeight={{ xs: 40, sm: 0 }}
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
              // TODO: adjust this to work better on xs/sm devices
              maxWidth="15vw"
            >
              <Typography variant="h6" noWrap={true}>
                {songName}&nbsp;
                <Box component="span" fontWeight="lighter" fontSize="1rem">
                  by {artist}
                </Box>
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
                    background: `
                    linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
                    linear-gradient(79.96deg, #387EFC 16.72%, #C940FD 91.26%),
                    #FFFFFF
                  `,
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
            <Box display="flex" alignItems="center">
              <ScoreOptionsMenu score={userScore} />
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

export const ProfileScoresCard = ({
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
              <ProfileScoreCard {...score} />
            </Paper>
          </Box>
        ))}
      </Stack>

      <TablePagination
        component={Box}
        sx={{ background: "#191527" }}
        count={-1}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
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
