import {
  Alert,
  Box,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import TablePagination from "@mui/material/TablePagination"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import {
  fetchLeaderboard,
  type LeaderboardResponse,
  type LeaderboardUser,
} from "../adapters/akatsuki-api/leaderboards"
import { GameMode, RelaxMode } from "../gameModes"
import {
  formatDecimal,
  formatNumber,
  formatNumberCompact,
} from "../utils/formatting"
import { FlagIcon } from "./DestinationIcons"

const USER_RANK_BG_COLOR = "rgba(21, 18, 35, 1)"
const USER_INFO_BG_COLOR = "rgba(30, 27, 47, 1)"
const SCORE_METRIC_BG_COLOR = "rgba(38, 34, 56, 1)"

export enum SortParam {
  Performance = "pp",
  Score = "score",
}

export interface CountrySelection {
  countryCode: string
  countryName: string
}

const MobileLeaderboardUserCard = ({
  user,
  sortParam,
  userRank,
}: {
  user: LeaderboardUser
  sortParam: SortParam
  userRank: number
}) => {
  const isPPLeaderboard = sortParam === SortParam.Performance

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
          <Typography variant="body1">#{userRank}</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          p={1}
          height="100%"
          sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
        >
          <FlagIcon country={user.country} height={36} width={36} />
          <Link
            to={`/u/${user.id}`}
            // eslint-disable-next-line react/forbid-component-props
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <Typography variant="body1" ml={1}>
              {user.username}
            </Typography>
          </Link>
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
          {isPPLeaderboard ? (
            <Typography variant="body1">
              ${formatNumber(user.chosenMode.pp)}pp
            </Typography>
          ) : (
            <Tooltip title={formatNumber(user.chosenMode.rankedScore)}>
              <Typography variant="body1">
                {formatNumberCompact(user.chosenMode.rankedScore)}
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
const LeaderboardUserCard = ({
  user,
  isMobile,
  sortParam,
  userRank,
}: {
  user: LeaderboardUser
  isMobile: boolean
  sortParam: SortParam
  userRank: number
}) => {
  if (isMobile) {
    return (
      <MobileLeaderboardUserCard
        user={user}
        sortParam={sortParam}
        userRank={userRank}
      />
    )
  }

  const isPPLeaderboard = sortParam === SortParam.Performance

  return (
    <Grid
      display="grid"
      mb={1}
      gridTemplateColumns="75px 1fr 102px 102px 102px"
      borderRadius={2}
      overflow="hidden"
      bgcolor={USER_INFO_BG_COLOR}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={USER_RANK_BG_COLOR}
      >
        <Typography variant="body1">#{userRank}</Typography>
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
          <FlagIcon country={user.country} height={36} width={36} />
          <Link
            to={`/u/${user.id}`}
            // eslint-disable-next-line react/forbid-component-props
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <Typography variant="body1" ml={1}>
              {user.username}
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="hsl(0deg 0 100% / 60%)"
      >
        <Typography variant="body1">
          {formatNumber(user.chosenMode.playcount)}
        </Typography>
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
          <Typography variant="body1">
            {formatDecimal(user.chosenMode.accuracy)}%
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={SCORE_METRIC_BG_COLOR}
      >
        {isPPLeaderboard ? (
          <Typography variant="body1">
            {formatNumber(user.chosenMode.pp)}pp
          </Typography>
        ) : (
          <Tooltip title={formatNumber(user.chosenMode.rankedScore)}>
            <Typography variant="body1">
              {formatNumberCompact(user.chosenMode.rankedScore)}
            </Typography>
          </Tooltip>
        )}
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
          Play Count
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
  countryCode,
}: {
  gameMode: GameMode
  relaxMode: RelaxMode
  sortParam: SortParam
  countryCode: string | null
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
          country: countryCode?.toLowerCase() ?? "",
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
  }, [gameMode, relaxMode, page, pageSize, countryCode, sortParam])

  if (loading || !leaderboardData) {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={75}></Skeleton>
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
        {leaderboardData.users?.map(
          (user: LeaderboardUser, userPageRank: number) => (
            <LeaderboardUserCard
              key={user.id}
              isMobile={isMobile}
              user={user}
              userRank={userPageRank + page * pageSize + 1}
              sortParam={sortParam}
            />
          )
        ) ?? (
          <Alert severity="warning">
            <Typography variant="body1">No users found!</Typography>
          </Alert>
        )}
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
        labelDisplayedRows={({ from, to }) => {
          return `Results ${from}-${to}`
        }}
      />
    </>
  )
}
