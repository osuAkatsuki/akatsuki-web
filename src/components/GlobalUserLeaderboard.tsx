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
  Grid,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import {
  fetchLeaderboard,
  type LeaderboardResponse,
} from "../adapters/akatsuki-api/leaderboards"
import { formatDecimal, formatNumber } from "../utils/formatting"

import { getFlagUrl } from "../utils/countries"
import { GameMode, RelaxMode } from "../gameModes"
import { type LeaderboardUser } from "../adapters/akatsuki-api/leaderboards"

const USER_RANK_BG_COLOR = "rgba(21, 18, 35, 1)"
const USER_INFO_BG_COLOR = "rgba(30, 27, 47, 1)"
const SCORE_METRIC_BG_COLOR = "rgba(38, 34, 56, 1)"

const MobileLeaderboardUserCard = ({ user }: { user: LeaderboardUser }) => {
  return (
    <Stack direction="column" borderRadius={4} mt={1} overflow="hidden">
      <Stack direction="row" bgcolor={USER_INFO_BG_COLOR}>
        <Box
          minWidth={75}
          p={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={SCORE_METRIC_BG_COLOR}
        >
          <Typography variant="body1">
            #{user.chosenMode.globalLeaderboardRank}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          p={1}
          height="100%"
          sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
        >
          <Box
            component="img"
            width={36}
            height={36}
            alt="flag-image"
            src={getFlagUrl(user.country)}
          />
          <Typography variant="body1" ml={1}>
            <Link
              to={`/u/${user.id}`}
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              {user.username}
            </Link>
          </Typography>
        </Box>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-around"
        bgcolor={USER_RANK_BG_COLOR}
      >
        <Stack direction="row" p={1}>
          <Typography fontSize={15} fontWeight={300}>
            Accuracy:&nbsp;
          </Typography>
          <Typography>{formatDecimal(user.chosenMode.accuracy)}%</Typography>
        </Stack>
        <Stack direction="row" p={1}>
          <Typography>{formatNumber(user.chosenMode.pp)}pp</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
const LeaderboardUserCard = ({
  user,
  isMobile,
}: {
  user: LeaderboardUser
  isMobile: boolean
}) => {
  if (isMobile) {
    return <MobileLeaderboardUserCard user={user} />
  }

  return (
    <Grid
      display="grid"
      mb={1}
      gridTemplateColumns="75px 1fr 102px 102px 102px"
      borderRadius={4}
      overflow="hidden"
      bgcolor={USER_INFO_BG_COLOR}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={USER_RANK_BG_COLOR}
      >
        <Typography>#{user.chosenMode.globalLeaderboardRank}</Typography>
      </Box>
      <Box bgcolor={USER_RANK_BG_COLOR}>
        <Box
          display="flex"
          alignItems="center"
          p={1}
          height="100%"
          bgcolor={USER_INFO_BG_COLOR}
          sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
        >
          <Box
            component="img"
            width={36}
            height={36}
            alt="flag-image"
            src={getFlagUrl(user.country)}
          />
          <Typography variant="body1" ml={1}>
            <Link
              to={`/u/${user.id}`}
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              {user.username}
            </Link>
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="hsl(0deg 0 100% / 60%)"
      >
        {formatNumber(user.chosenMode.playcount)}
      </Box>
      <Box bgcolor={SCORE_METRIC_BG_COLOR}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={USER_INFO_BG_COLOR}
          color="hsl(0deg 0 100% / 60%)"
          height="100%"
          sx={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
        >
          {formatDecimal(user.chosenMode.accuracy)}%
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={SCORE_METRIC_BG_COLOR}
      >
        {formatNumber(user.chosenMode.pp)}pp
      </Box>
    </Grid>
  )
}

const LeaderboardTableHeader = ({
  rankingStatistic,
  isMobile,
}: {
  rankingStatistic: string
  isMobile: boolean
}) => {
  if (isMobile) return <></>

  return (
    <Grid display="grid" gridTemplateColumns="75px 1fr 102px 102px 102px">
      <Grid item p={1} display="flex" justifyContent="center">
        <Typography display="none">Rank</Typography>
      </Grid>
      <Grid item p={1}>
        <Typography display="none">Username</Typography>
      </Grid>
      <Grid item p={1} display="flex" justifyContent="center">
        <Typography
          fontSize={15}
          fontWeight={300}
          color="hsl(0deg 0 100% / 60%)"
        >
          Playcount
        </Typography>
      </Grid>
      <Grid item p={1} display="flex" justifyContent="center">
        <Typography
          fontSize={15}
          fontWeight={300}
          color="hsl(0deg 0 100% / 60%)"
        >
          Accuracy
        </Typography>
      </Grid>
      <Grid item p={1} display="flex" justifyContent="center">
        <Typography fontSize={15} fontWeight={300}>
          {rankingStatistic}
        </Typography>
      </Grid>
    </Grid>
  )
}

export const GlobalUserLeaderboard = ({
  gameMode,
  relaxMode,
  sortParam,
  country,
}: {
  gameMode: GameMode
  relaxMode: RelaxMode
  sortParam: string
  country: string | null
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [error, setError] = useState("")

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
          country: country ?? "",
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
      <LeaderboardTableHeader
        isMobile={isMobile}
        rankingStatistic={sortParam}
      />
      <Stack>
        {leaderboardData?.users.map((user: LeaderboardUser) => (
          <LeaderboardUserCard isMobile={isMobile} user={user} />
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
    </>
  )
}
