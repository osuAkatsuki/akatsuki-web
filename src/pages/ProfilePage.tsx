import { useParams } from "react-router-dom"
import {
  Typography,
  Tooltip,
  Alert,
  Avatar,
  Button,
  Divider,
  LinearProgress,
} from "@mui/material"
import { linearProgressClasses } from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import PublicIcon from "@mui/icons-material/Public"
import WifiIcon from "@mui/icons-material/Wifi"
import WifiOffIcon from "@mui/icons-material/WifiOff"
import { GameMode, RelaxMode } from "../gameModes"
import { getCountryName, getFlagUrl } from "../utils/countries"
import { ProfileSelectionBar } from "../components/ProfileSelectionBar"
import {
  fetchUser,
  UserFullResponse,
  UserTournamentBadge,
} from "../adapters/akatsuki-api/users"
import { AddUserIcon } from "../components/images/icons/AddUserIcon"
import { UserProfileHistoryGraph } from "../components/UserProfileHistoryGraph"
import { UserProfileStats } from "../components/UserProfileStats"
import { UserProfileScores } from "../components/UserProfileScores"
import { userIsOnline } from "../adapters/bancho"
import { ProfileHistoryType } from "../adapters/akatsuki-api/profileHistory"
import moment from "moment"
import {
  GameModeSelector,
  RelaxModeSelector,
} from "../components/GameModeSelector"
import { StandardGameModeIcon } from "../components/images/gamemode-icons/StandardGameModeIcon"
import { TaikoGameModeIcon } from "../components/images/gamemode-icons/TaikoGameModeIcon"
import { CatchGameModeIcon } from "../components/images/gamemode-icons/CatchGameModeIcon"
import { ManiaGameModeIcon } from "../components/images/gamemode-icons/ManiaGameModeIcon"
import { formatDecimal, formatNumber } from "../utils/formatting"
import { LevelDisplayPolygon } from "../components/images/polygons/LevelDisplay"
import { UserPrivileges } from "../utils/privileges"

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
  if (userPrivileges & UserPrivileges.AdminManageNominators) {
    return {
      text: "Nomination Quality Assurance",
      color: "rgba(170, 154, 255, 1)",
    }
  }
  // TODO: the many many others. And perhaps the concept of privilege groups.
  return null
}

const TournamentBadges = ({ badges }: { badges: UserTournamentBadge[] }) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={1} useFlexGap>
      {badges.map((tournamentBadge) => (
        <Tooltip title={tournamentBadge.name}>
          <Avatar
            key={tournamentBadge.id}
            alt={tournamentBadge.name}
            src={tournamentBadge.icon}
            variant="rounded"
            sx={{ width: 104, height: 50 }}
          />
        </Tooltip>
      ))}
    </Stack>
  )
}
export const ProfilePage = () => {
  const queryParams = useParams()

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

  const currentModeStats =
    userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]

  const levelCompletionPercentage =
    (currentModeStats.level - Math.trunc(currentModeStats.level)) * 100

  const userTitleDisplay = getUserTitleDisplay(userProfile.privileges)

  return (
    <>
      <Stack direction="column" spacing={2} mt={2}>
        {/* Left User Info Display (avatar, name, etc.) */}
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
            <Stack direction="row" alignItems="center" spacing={1}>
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
              <Tooltip
                title={getCountryName(userProfile.country)}
                placement="top"
              >
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
              <Typography variant="h6" color={userTitleDisplay.color}>
                {userTitleDisplay.text}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" px={3} py={1}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="lighter">
                joined
              </Typography>{" "}
              <Typography variant="body1" fontWeight="bold">
                {moment(userProfile.registeredOn).fromNow()}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="lighter">
                last seen
              </Typography>{" "}
              <Typography variant="body1" fontWeight="bold">
                {moment(userProfile.latestActivity).fromNow()}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            bgcolor="rgba(18, 15, 29, 1)"
            borderRadius={11}
            py={0.5}
            alignItems="center"
          >
            {/* TODO: color icon based on relationship status */}
            {/* https://www.figma.com/design/moJEAJT6UYGnwQYIuKzanf?node-id=76-1050#878804687 */}

            <Box width={23} height={23}>
              <AddUserIcon />
            </Box>
            <Typography variant="h6">{userProfile.followers}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        px={3}
        py={1}
        pb={2}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
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

      <Stack direction="column" spacing={2}>
        <Divider />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          px={3}
          justifyContent="space-evenly"
        >
          <Box pb={2} pr={3} width={{ xs: "100%", sm: "33.33%" }}>
            {/* Tournament Badges */}
            {userProfile.tbadges && (
              <TournamentBadges badges={userProfile.tbadges} />
            )}
            <UserProfileStats
              statsData={currentModeStats}
              followers={userProfile.followers}
            />
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1}>
              <Box position="relative" width="25%" height={80}>
                <Box
                  position="absolute"
                  zIndex={0}
                  top={0}
                  left={0}
                  height={80}
                  width={80}
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
                    {Math.trunc(currentModeStats.level)}
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
                  {Math.trunc(currentModeStats.level) + 1}
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
            {userProfile.clan.id !== 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1}>
                  <Box
                    component="img"
                    width={70}
                    height={70}
                    borderRadius={2}
                    src={
                      userProfile.clan.icon !== ""
                        ? userProfile.clan.icon
                        : "https://a.akatsuki.gg/default"
                    }
                  />
                  <Stack direction="column" justifyContent="center">
                    <Typography variant="h6">Clan</Typography>
                    <Typography variant="body1">
                      {userProfile.clan.name}
                    </Typography>
                  </Stack>
                </Stack>
              </>
            )}
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box width={{ xs: "100%", sm: "66.67%" }}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <Button
                  variant="text"
                  onClick={() =>
                    setProfileHistoryType(ProfileHistoryType.GlobalRank)
                  }
                  sx={{ color: "white" }}
                >
                  <Stack direction="row" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PublicIcon sx={{ width: 32, height: 32 }} />
                      <Typography variant="h6">
                        #{currentModeStats.globalLeaderboardRank ?? " N/A"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
                <Button
                  variant="text"
                  onClick={() =>
                    setProfileHistoryType(ProfileHistoryType.CountryRank)
                  }
                  sx={{ color: "white" }}
                >
                  <Stack direction="row" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        component="img"
                        width={32}
                        height={32}
                        alt="flag-image"
                        src={getFlagUrl(userProfile.country)}
                      />
                      <Typography variant="h6">
                        #{currentModeStats.countryLeaderboardRank ?? " N/A"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
                {/* TODO: performance graph? accuracy graph? */}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6">
                    {formatNumber(currentModeStats.pp)}
                  </Typography>{" "}
                  <Typography variant="h6" fontWeight="lighter">
                    pp
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6">
                    {formatDecimal(currentModeStats.accuracy)}%
                  </Typography>
                  <Typography variant="h6" fontWeight="lighter">
                    accuracy
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <UserProfileHistoryGraph
              userId={profileUserId}
              type={profileHistoryType}
              gameMode={gameMode}
              relaxMode={relaxMode}
            />

            <Box>
              {/* TODO: hide if no pinned scores exist */}
              <UserProfileScores
                scoresType="pinned"
                userId={profileUserId}
                gameMode={gameMode}
                relaxMode={relaxMode}
                title="Pinned Scores"
              />
            </Box>
            <Divider />
            <Box>
              <UserProfileScores
                scoresType="best"
                userId={profileUserId}
                gameMode={gameMode}
                relaxMode={relaxMode}
                title="Best Scores"
              />
            </Box>
            <Divider />
            <Box>
              <UserProfileScores
                scoresType="recent"
                userId={profileUserId}
                gameMode={gameMode}
                relaxMode={relaxMode}
                title="Recent Scores"
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  )
}
