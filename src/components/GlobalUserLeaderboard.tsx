import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TablePagination from "@mui/material/TablePagination"
import TableContainer from "@mui/material/TableContainer"
import { Link } from "react-router-dom"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
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
import { useUiStateContext } from "../context/ui-state"

export const GlobalUserLeaderboard = (): JSX.Element => {
  // TODO: potentially generalize this to take the input of a generic RankedStats[] model
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const { setUiState } = useUiStateContext()

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

  // This page uses the dark variant of the navbar
  setUiState({ navbarVariant: "dark" })

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
    <>
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="leaderboard-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>Global Rank</Typography>
              </TableCell>
              <TableCell>
                <Typography>Country</Typography>
              </TableCell>
              <TableCell>
                <Typography>Username</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>Performance</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>Overall Accuracy</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>Ranked Score</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>Play Count</Typography>
              </TableCell>
              {/* <TableCell align="right">
              <Typography>Level</Typography>
            </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* TODO: username instead of account id */}
            {Object.entries(leaderboardData.users).map(
              ([index, user]: [string, LeaderboardUser]) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography>
                      #{Number(index) + page * pageSize + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {/* TODO: dynamic flags */}
                    <Box
                      component="img"
                      width={36}
                      height={36}
                      alt="flag-image"
                      src={getFlagUrl(user.country)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography>
                      <Link
                        to={`/u/${user.id}`}
                        style={{
                          color: prefersDarkMode ? "#fff" : "#000",
                          textDecoration: "none",
                        }}
                      >
                        {user.username}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      {formatNumber(user.chosenMode.pp)}pp
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      {formatDecimal(user.chosenMode.accuracy)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      {formatNumber(user.chosenMode.rankedScore)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      {formatNumber(user.chosenMode.playcount)}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="right">Lv. {row.level}</TableCell> */}
                </TableRow>
              )
            )}
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
    </>
  )
}
