import TablePagination from "@mui/material/TablePagination"
import { Link } from "react-router-dom"
import Paper from "@mui/material/Paper"
import {
  Box,
  Alert,
  Typography,
  Skeleton,
  Stack,
  useMediaQuery,
} from "@mui/material"

import { useEffect, useState } from "react"
import {
  fetchLeaderboard,
  type LeaderboardResponse,
} from "../adapters/akatsuki-api/leaderboards"
import { LeaderboardSelectionBar } from "../components/LeaderboardSelectionBar"
import { formatDecimal, formatNumber } from "../utils/formatting"

import { getFlagUrl } from "../utils/countries"
import { GameMode, RelaxMode } from "../gameModes"
import { type LeaderboardUser } from "../adapters/akatsuki-api/leaderboards"

const LeaderboardUserCard = (user: LeaderboardUser) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="rgba(21, 18, 35, 1)"
    >
      <Box minWidth={75} display="flex" justifyContent="center">
        <Typography variant="body1">
          #{user.chosenMode.globalLeaderboardRank}
        </Typography>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexGrow={1}
        bgcolor="rgba(38, 34, 56, 1)"
        borderRadius="8px"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          bgcolor="rgba(30, 27, 47, 1)"
          p={1}
          flexGrow={1}
          borderRadius="8px"
        >
          <Box
            component="img"
            width={36}
            height={36}
            alt="flag-image"
            src={getFlagUrl(user.country)}
          />
          <Typography variant="body1" flexGrow={1}>
            <Link
              to={`/u/${user.id}`}
              style={{
                color: prefersDarkMode ? "#FFFFFF" : "#000000",
                textDecoration: "none",
              }}
            >
              {user.username}
            </Link>
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.6 }}>
            {user.chosenMode.playcount}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.6 }}>
            {formatDecimal(user.chosenMode.accuracy)}%
          </Typography>
        </Stack>
        <Box px={2}>
          <Typography variant="body1">
            {formatNumber(user.chosenMode.pp)}pp
          </Typography>
        </Box>
      </Stack>
    </Stack>
  )
}

export const GlobalUserLeaderboard = (): JSX.Element => {
  // TODO: potentially generalize this to take the input of a generic RankedStats[] model
  const [error, setError] = useState("")

  const [gameMode, setGameMode] = useState(GameMode.Standard)
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla)
  const [country, setCountry] = useState("")
  const [sortParam, setSortParam] = useState("")

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)

  const [loading, setLoading] = useState(true)

  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardResponse | null>(null)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      try {
        const leaderboardResponse = await fetchLeaderboard({
          mode: gameMode,
          rx: relaxMode,
          p: page + 1,
          l: pageSize,
          country: country,
          sort: sortParam,
        })
        setLeaderboardData(leaderboardResponse)
        setLoading(false)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch data from server")
        return
      }
    })()
  }, [gameMode, relaxMode, page, pageSize, country, sortParam])

  if (loading || !leaderboardData) {
    return (
      <>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
        >
          {/* Game Modes */}
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width={105} height={35}></Skeleton>
            <Skeleton variant="rectangular" width={70} height={35}></Skeleton>
            <Skeleton variant="rectangular" width={143} height={35}></Skeleton>
            <Skeleton variant="rectangular" width={75} height={35}></Skeleton>
          </Stack>
          {/* Relax Modes */}
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width={88} height={35}></Skeleton>
            <Skeleton variant="rectangular" width={75} height={35}></Skeleton>
            <Skeleton variant="rectangular" width={105} height={35}></Skeleton>
          </Stack>
        </Stack>
        {Array.from({ length: pageSize }).map(() => (
          <Skeleton variant="rectangular" height={75}></Skeleton>
        ))}
      </>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box>
      <LeaderboardSelectionBar
        gameMode={gameMode}
        relaxMode={relaxMode}
        country={country}
        sortParam={sortParam}
        setGameMode={setGameMode}
        setRelaxMode={setRelaxMode}
        setCountry={setCountry}
        setSortParam={setSortParam}
      />
      <Stack spacing={1} sx={{ pb: 1 }}>
        {leaderboardData?.users.map((user: LeaderboardUser) => (
          <Box borderRadius="16px" overflow="hidden">
            <Paper elevation={1}>
              <LeaderboardUserCard {...user} />
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
