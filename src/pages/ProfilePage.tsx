import { Link, useParams } from "react-router-dom"
import {
  Typography,
  Tooltip,
  Alert,
  Avatar,
  Button,
  Divider,
  LinearProgress,
  IconButton,
  Paper,
  TablePagination,
  useMediaQuery,
  Container,
} from "@mui/material"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import DefaultProfileBanner from "../components/images/banners/default_profile.png"
import { linearProgressClasses } from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import PublicIcon from "@mui/icons-material/Public"
import { GameMode, RelaxMode } from "../gameModes"
import { getCountryName, getFlagUrl } from "../utils/countries"
import {
  fetchUser,
  UserClan,
  UserFullResponse,
  UserStats,
  UserTournamentBadge,
} from "../adapters/akatsuki-api/users"
import { useTheme } from "@mui/material/styles"
import { AddUserIcon } from "../components/images/icons/AddUserIcon"
import { userIsOnline } from "../adapters/bancho"
import {
  captureTypeToDisplay,
  fetchUserProfileHistory,
  ProfileHistoryCapture,
  ProfileHistoryResponse,
  ProfileHistoryType,
} from "../adapters/akatsuki-api/profileHistory"
import moment from "moment"
import {
  GameModeSelector,
  RelaxModeSelector,
} from "../components/GameModeSelector"
import { StandardGameModeIcon } from "../components/images/gamemode-icons/StandardGameModeIcon"
import { TaikoGameModeIcon } from "../components/images/gamemode-icons/TaikoGameModeIcon"
import { CatchGameModeIcon } from "../components/images/gamemode-icons/CatchGameModeIcon"
import { ManiaGameModeIcon } from "../components/images/gamemode-icons/ManiaGameModeIcon"
import {
  formatDecimal,
  formatNumber,
  formatTimespan,
} from "../utils/formatting"
import { LevelDisplayPolygon } from "../components/images/polygons/LevelDisplay"
import { UserPrivileges } from "../utils/privileges"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../scores"
import {
  fetchUserScores,
  UserScore,
  UserScoresResponse,
} from "../adapters/akatsuki-api/userScores"
import { formatMods } from "../utils/mods"
import { Line } from "react-chartjs-2"

const modeToStatsIndex = (
  mode: GameMode
): "std" | "taiko" | "ctb" | "mania" => {
  switch (mode) {
    case GameMode.Standard:
      return "std"
    case GameMode.Taiko:
      return "taiko"
    case GameMode.Catch:
      return "ctb"
    case GameMode.Mania:
      return "mania"
  }
}

interface UserTitleDisplay {
  text: string
  color: string
}

const getUserTitleDisplay = (
  userPrivileges: number
): UserTitleDisplay | null => {
  if (userPrivileges & UserPrivileges.AdminCaker) {
    return {
      text: "Core Development Team",
      color: "linear-gradient(90deg, #387EFC 0%, #C940FD 100%)",
    }
  } else if (userPrivileges & UserPrivileges.AdminManageNominators) {
    return {
      text: "Nomination Quality Assurance",
      color: "rgba(170, 154, 255, 1)",
    }
  }
  // TODO: the many many others. And perhaps the concept of privilege groups.
  return null
}

const TournamentBadgeCard = ({ badge }: { badge: UserTournamentBadge }) => {
  return (
    <Tooltip title={badge.name}>
      <Avatar
        key={badge.id}
        alt={badge.name}
        src={badge.icon}
        variant="rounded"
        sx={{ width: 104, height: 50 }}
      />
    </Tooltip>
  )
}

const TournamentBadgesCard = ({
  badges,
}: {
  badges: UserTournamentBadge[]
}) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={1} useFlexGap>
      {badges.map((tournamentBadge) => (
        <TournamentBadgeCard key={tournamentBadge.id} badge={tournamentBadge} />
      ))}
    </Stack>
  )
}

const ModeSelectionBar = ({
  gameMode,
  setGameMode,
  relaxMode,
  setRelaxMode,
}: {
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
  relaxMode: RelaxMode
  setRelaxMode: (mode: RelaxMode) => void
}) => {
  return (
    <Stack
      px={3}
      py={2}
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "center" }}
    >
      <Stack direction="row" gap={3}>
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Standard}
          setGameMode={setGameMode}
          icon={<StandardGameModeIcon />}
        />
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Taiko}
          setGameMode={setGameMode}
          icon={<TaikoGameModeIcon />}
        />
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Catch}
          setGameMode={setGameMode}
          icon={<CatchGameModeIcon />}
        />
        <GameModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetGameMode={GameMode.Mania}
          setGameMode={setGameMode}
          icon={<ManiaGameModeIcon />}
        />
      </Stack>

      <Stack direction="row" gap={3}>
        <RelaxModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetRelaxMode={RelaxMode.Vanilla}
          setRelaxMode={setRelaxMode}
        />
        <RelaxModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetRelaxMode={RelaxMode.Relax}
          setRelaxMode={setRelaxMode}
        />
        <RelaxModeSelector
          currentGameMode={gameMode}
          currentRelaxMode={relaxMode}
          targetRelaxMode={RelaxMode.Autopilot}
          setRelaxMode={setRelaxMode}
        />
      </Stack>
    </Stack>
  )
}

const UserGradesCard = ({ statsData }: { statsData: UserStats }) => {
  // TODO: once these are hooked up in user stats API
  const xhCount = 0
  const shCount = 0
  const xCount = 0
  const sCount = 0
  const aCount = 0

  return (
    <>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("XH")}>
            SS
          </Typography>
          <Typography variant="h5">{formatNumber(xhCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("SH")}>
            S
          </Typography>
          <Typography variant="h5">{formatNumber(shCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("X")}>
            SS
          </Typography>
          <Typography variant="h5">{formatNumber(xCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("S")}>
            S
          </Typography>
          <Typography variant="h5">{formatNumber(sCount)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" color={getGradeColor("A")}>
            A
          </Typography>
          <Typography variant="h5">{formatNumber(aCount)}</Typography>
        </Stack>
      </Stack>
    </>
  )
}

const UserStatsCard = ({
  statsData,
  followers,
}: {
  statsData: UserStats
  followers: number
}) => {
  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Performance Points</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.pp)}pp
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Overall Accuracy</Typography>
          <Typography variant="body1" textAlign="end">
            {formatDecimal(statsData.accuracy)}%
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Ranked Score</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.rankedScore)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Total Score</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.totalScore)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Highest Combo</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.maxCombo)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Total Hits</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.totalHits)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Play Count</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.playcount)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Play Time</Typography>
          <Typography variant="body1" textAlign="end">
            {formatTimespan(statsData.playtime) || "Never played"}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Replays Watched</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(statsData.replaysWatched)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Followers</Typography>
          <Typography variant="body1" textAlign="end">
            {formatNumber(followers)}
          </Typography>
        </Stack>
        <UserGradesCard statsData={statsData} />
      </Stack>
    </Box>
  )
}

const UserLevelCard = ({ level }: { level: number }) => {
  const levelCompletionPercentage = (level - Math.trunc(level)) * 100

  return (
    <Stack direction="row" spacing={1}>
      <Box position="relative" width="25%" height={80}>
        <Box
          position="absolute"
          zIndex={0}
          top={0}
          left={0}
          height="100%"
          width="100%"
        >
          <LevelDisplayPolygon />
        </Box>
        <Box
          display="flex"
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            {Math.trunc(level)}
          </Typography>
        </Box>
      </Box>
      <Stack
        direction="column"
        justifyContent="center"
        spacing={0.5}
        width="75%"
      >
        <Typography variant="body1" fontWeight="lighter">
          {formatDecimal(levelCompletionPercentage)}% to level{" "}
          {Math.trunc(level) + 1}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={levelCompletionPercentage}
          sx={{
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: "rgba(58, 52, 85, 1)",
            },
            "> span": {
              background:
                "linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)",
            },
          }}
        />
      </Stack>
    </Stack>
  )
}

const UserClanCard = ({ clan }: { clan: UserClan }) => {
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box
          component="img"
          width={70}
          height={70}
          borderRadius={2}
          src={clan.icon !== "" ? clan.icon : "https://a.akatsuki.gg/default"}
        />
        <Stack direction="column" justifyContent="center">
          <Typography variant="h6">Clan</Typography>
          <Typography variant="body1">{clan.name}</Typography>
        </Stack>
      </Stack>
    </>
  )
}

const ProfileHistoryGraphNavbar = ({
  userStats,
  country,
  setProfileHistoryType,
}: {
  userStats: UserStats
  country: string
  setProfileHistoryType: (type: ProfileHistoryType) => void
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent={{ sm: "space-between" }}
    >
      <Stack direction="row" spacing={1} justifyContent={{ xs: "center" }}>
        <Button
          variant="text"
          onClick={() => setProfileHistoryType(ProfileHistoryType.GlobalRank)}
          sx={{ color: "white" }}
        >
          <Stack direction="row" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PublicIcon sx={{ width: 32, height: 32 }} />
              <Typography variant="h6">
                #{userStats.globalLeaderboardRank ?? " N/A"}
              </Typography>
            </Stack>
          </Stack>
        </Button>
        <Button
          variant="text"
          onClick={() => setProfileHistoryType(ProfileHistoryType.CountryRank)}
          sx={{ color: "white" }}
        >
          <Stack direction="row" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                width={32}
                height={32}
                alt="flag-image"
                src={getFlagUrl(country)}
              />
              <Typography variant="h6">
                #{userStats.countryLeaderboardRank ?? " N/A"}
              </Typography>
            </Stack>
          </Stack>
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={{ xs: 1, sm: 2 }}>
        <Button
          variant="text"
          onClick={() => setProfileHistoryType(ProfileHistoryType.PP)}
          sx={{ color: "white", textTransform: "none" }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">{formatNumber(userStats.pp)}</Typography>
            <Typography variant="h6" fontWeight="lighter">
              pp
            </Typography>
          </Stack>
        </Button>
        {/* TODO: profile history data collection for accuracy */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">
            {formatDecimal(userStats.accuracy)}%
          </Typography>
          <Typography variant="h6" fontWeight="lighter">
            accuracy
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

const UserIdentityCard = ({
  userProfile,
}: {
  userProfile: UserFullResponse
}) => {
  const userTitleDisplay = getUserTitleDisplay(userProfile.privileges)

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      p={2}
      width="100%"
      border={1}
      borderRadius={4}
      // TODO: try to figure out the border gradient perhaps?
      borderColor="rgba(255, 255, 255, 0.3)"
    >
      <Avatar
        alt="user-avatar"
        src={`https://a.akatsuki.gg/${userProfile.id}`}
        variant="square"
        sx={{ width: 156, height: 156, borderRadius: "16px" }}
      />
      <Stack direction="column" spacing={1}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          spacing={1}
        >
          {/* TODO: clan tag prefixing username */}
          {userProfile.clan.id !== 0 && (
            <Box bgcolor="white" borderRadius={11} py={0.5} px={2}>
              <Typography variant="h5" color="black">
                {userProfile.clan.tag}
              </Typography>
            </Box>
          )}
          <Typography fontWeight="bold" variant="h4">
            {userProfile.username}
          </Typography>
          <Tooltip title={getCountryName(userProfile.country)} placement="top">
            <Box
              component="img"
              width={30}
              height={30}
              alt="flag-image"
              src={getFlagUrl(userProfile.country)}
            />
          </Tooltip>
        </Stack>
        {userTitleDisplay !== null && (
          <Typography
            variant="h6"
            sx={{
              background: userTitleDisplay.color,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {userTitleDisplay.text}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

const UserActivityDatesCard = ({
  userProfile,
}: {
  userProfile: UserFullResponse
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
      spacing={{ xs: 1, sm: 3 }}
    >
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          joined
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {moment(userProfile.registeredOn).fromNow()}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          last seen
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {moment(userProfile.latestActivity).fromNow()}
        </Typography>
      </Stack>
    </Stack>
  )
}

const UserRelationshipCard = ({ followers }: { followers: number }) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      bgcolor="rgba(18, 15, 29, 1)"
      borderRadius={11}
      py={0.5}
      px={1.5}
      alignItems="center"
    >
      {/* TODO: color icon based on relationship status */}
      {/* https://www.figma.com/design/moJEAJT6UYGnwQYIuKzanf?node-id=76-1050#878804687 */}

      <Box width={23} height={23}>
        <AddUserIcon />
      </Box>
      <Typography variant="h6">{followers}</Typography>
    </Stack>
  )
}

const SONG_NAME_REGEX =
  /^(?<artist>[^-]+) - (?<songName>[^[]+) \[(?<version>.+)\]$/

const SCORE_PP_DISPLAY_GRADIENT =
  "linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(79.96deg, #387EFC 16.72%, #C940FD 91.26%), #FFFFFF"

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

const ProfileScoresCard = ({
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

const UserProfileHistoryGraph = ({
  userId,
  type,
  gameMode,
  relaxMode,
}: {
  userId: number
  type: ProfileHistoryType
  gameMode: GameMode
  relaxMode: RelaxMode
}) => {
  const [profileHistoryResponse, setProfileHistoryResponse] =
    useState<ProfileHistoryResponse | null>(null)

  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetchUserProfileHistory({
          type,
          userId,
          akatsukiMode: gameMode + relaxMode * 4,
        })
        setProfileHistoryResponse(response)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch data from server")
        return
      }
    })()
  }, [type, userId, gameMode, relaxMode])

  if (error || !profileHistoryResponse) {
    return <Alert severity="error">{error}</Alert>
  }

  if (profileHistoryResponse.captures.length === 0) {
    return (
      <Alert severity="warning">
        <Typography variant="body2" fontWeight="bold">
          No data available to display with history charts
        </Typography>
        <Typography variant="body2">
          (First, play some osu! to estalish a base!)
        </Typography>
      </Alert>
    )
  }

  const chartData = {
    labels: profileHistoryResponse.captures.map(
      (capture: ProfileHistoryCapture) => {
        return capture.capturedAt.toLocaleDateString()
      }
    ),
    datasets: [
      {
        label: captureTypeToDisplay(type),
        data: profileHistoryResponse.captures.map(
          (capture: ProfileHistoryCapture) => capture.value
        ),
        fill: false,
        borderColor: "#1976d2",
        tension: 0.1,
      },
    ],
  }

  const options = {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        grace: "10%",
        reverse: [
          ProfileHistoryType.CountryRank,
          ProfileHistoryType.GlobalRank,
        ].includes(type),
        type: "linear",
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        intersect: false,
      },
    },
  } as const
  return (
    <>
      <Line data={chartData} options={options} />
    </>
  )
}

const UserProfileHistoryCard = ({
  userProfile,
  gameMode,
  relaxMode,
  profileHistoryType,
  setProfileHistoryType,
}: {
  userProfile: UserFullResponse
  gameMode: GameMode
  relaxMode: RelaxMode
  profileHistoryType: ProfileHistoryType
  setProfileHistoryType: (type: ProfileHistoryType) => void
}) => {
  const modeStats = userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]

  return (
    <>
      <ProfileHistoryGraphNavbar
        userStats={modeStats}
        country={userProfile.country}
        setProfileHistoryType={setProfileHistoryType}
      />
      <UserProfileHistoryGraph
        userId={userProfile.id}
        type={profileHistoryType}
        gameMode={gameMode}
        relaxMode={relaxMode}
      />
    </>
  )
}

const UserpageCard = ({ userProfile }: { userProfile: UserFullResponse }) => {
  // TODO: setup a userpage with bbcode support, etc.
  return <></>
}

export const ProfilePage = () => {
  const queryParams = useParams()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.up("xs"))

  const profileUserId = parseInt(queryParams["userId"] ?? "0")

  const [error, setError] = useState("")

  const [userProfile, setUserProfile] = useState<UserFullResponse | null>(null)
  const [profileHistoryType, setProfileHistoryType] =
    useState<ProfileHistoryType>(ProfileHistoryType.GlobalRank)
  const [isOnline, setIsOnline] = useState(false)

  const [gameMode, setGameMode] = useState(GameMode.Standard)
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla)

  useEffect(() => {
    ;(async () => {
      if (!profileUserId) return

      try {
        const usersResponse = await fetchUser(profileUserId)
        setUserProfile(usersResponse)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch user profile data from server")
        return
      }
    })()
  }, [profileUserId])

  useEffect(() => {
    ;(async () => {
      const response = await userIsOnline({ userId: profileUserId })
      setIsOnline(response.result)
    })()
  })

  if (!profileUserId) {
    return (
      <>
        <Typography variant="h2">
          Must provide an account id in the path.
        </Typography>
      </>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong while loading the page {error}
      </Alert>
    )
  }

  if (!userProfile) {
    return <>loading data</>
  }

  const modeStats = userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]

  return (
    <Box>
      <Box
        pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${DefaultProfileBanner})`,
          backgroundPosition: "center",
          // TODO: figure out how to disable this shadow effect within UserIdentityCard
          boxShadow: "inset 0px 0px 0px 2000px rgba(21, 18, 34, 0.9)",
        }}
      >
        <Container>
          <Stack direction="column">
            <UserIdentityCard userProfile={userProfile} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
              px={3}
              py={2}
              spacing={{ xs: 1, sm: 0 }}
            >
              <UserActivityDatesCard userProfile={userProfile} />
              <UserRelationshipCard followers={userProfile.followers} />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box width="100%" bgcolor="#211D35" color="#FFFFFF80">
        <Container>
          <ModeSelectionBar
            gameMode={gameMode}
            setGameMode={setGameMode}
            relaxMode={relaxMode}
            setRelaxMode={setRelaxMode}
          />
        </Container>
      </Box>
      <Container sx={{ backgroundColor: "#191527" }}>
        <Stack direction="column" spacing={2} pt={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ sm: 2 }}
            px={3}
            justifyContent="space-evenly"
          >
            {/* Left Side (Stats, Clan, etc.) */}
            <Box pb={2} pr={{ sm: 3 }} width={{ xs: "100%", sm: "33.33%" }}>
              {userProfile.tbadges && (
                <TournamentBadgesCard badges={userProfile.tbadges} />
              )}
              <UserStatsCard
                statsData={modeStats}
                followers={userProfile.followers}
              />
              <Divider sx={{ my: 2 }} />
              <UserLevelCard level={modeStats.level} />
              {userProfile.clan.id !== 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <UserClanCard clan={userProfile.clan} />
                </>
              )}
            </Box>

            {!isMobile && <Divider orientation="vertical" flexItem />}

            {/* Right Side (Profile History, Scores, etc.) */}
            <Box width={{ xs: "100%", sm: "66.67%" }}>
              <UserpageCard userProfile={userProfile} />

              <UserProfileHistoryCard
                userProfile={userProfile}
                gameMode={gameMode}
                relaxMode={relaxMode}
                profileHistoryType={profileHistoryType}
                setProfileHistoryType={setProfileHistoryType}
              />

              <ProfileScoresCard
                scoresType="pinned"
                userId={userProfile.id}
                gameMode={gameMode}
                relaxMode={relaxMode}
                title="Pinned Scores"
              />
              <Divider />
              <ProfileScoresCard
                scoresType="best"
                userId={userProfile.id}
                gameMode={gameMode}
                relaxMode={relaxMode}
                title="Best Scores"
              />
              <Divider />
              <ProfileScoresCard
                scoresType="recent"
                userId={profileUserId}
                gameMode={gameMode}
                relaxMode={relaxMode}
                title="Recent Scores"
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
