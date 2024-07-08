import { useParams } from "react-router-dom"
import {
  Typography,
  Tooltip,
  Alert,
  Avatar,
  Button,
  Divider,
} from "@mui/material"
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
import { UserProfileHistoryGraph } from "../components/UserProfileHistoryGraph"
import { UserProfileStats } from "../components/UserProfileStats"
import { UserProfileScores } from "../components/UserProfileScores"
import { userIsOnline } from "../adapters/bancho"
import { ProfileHistoryType } from "../adapters/akatsuki-api/profileHistory"
import moment from "moment"

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

  return (
    <>
      <Stack direction="column" spacing={2} mt={2}>
        <Stack direction="row" justifyContent="space-between">
          {/* Left User Info Display (avatar, name, etc.) */}
          <Stack direction="row" spacing={2} padding={2} width="50%">
            <Avatar
              alt="user-avatar"
              src={`https://a.akatsuki.gg/${userProfile.id}`}
              variant="square"
              sx={{ width: 156, height: 156 }}
            />
            <Stack direction="column" justifyContent="flex-end">
              {/* TODO: rank label beside username */}
              <Typography fontWeight="bold" variant="h4">
                {userProfile.username}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  component="img"
                  width={30}
                  height={30}
                  alt="flag-image"
                  src={getFlagUrl(userProfile.country)}
                />{" "}
                <Typography variant="body1">
                  {getCountryName(userProfile.country)}
                </Typography>{" "}
              </Stack>
              {isOnline ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <WifiIcon sx={{ width: 20, height: 20 }} color="success" />
                  <Typography variant="body1">
                    Status:{" "}
                    <Typography display="inline" fontWeight="bold">
                      Online
                    </Typography>
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <WifiOffIcon sx={{ width: 20, height: 20 }} color="error" />
                  <Typography variant="body1">
                    Status:{" "}
                    <Typography display="inline" fontWeight="bold">
                      Offline
                    </Typography>
                  </Typography>
                </Stack>
              )}
              <Typography variant="subtitle2">
                Last seen:{" "}
                <Typography display="inline" fontWeight="bold">
                  {userProfile !== null
                    ? moment(userProfile.latestActivity).fromNow()
                    : "N/A"}
                </Typography>
              </Typography>
              <Typography variant="subtitle2">
                Registered:{" "}
                <Typography display="inline" fontWeight="bold">
                  {userProfile !== null
                    ? moment(userProfile.registeredOn).fromNow()
                    : "N/A"}
                </Typography>
              </Typography>
              {/* Tournament Badges */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {userProfile.tbadges
                  ? userProfile.tbadges.map(
                      (tournamentBadge: UserTournamentBadge) => (
                        <Tooltip title={tournamentBadge.name}>
                          <Avatar
                            key={tournamentBadge.id}
                            alt={tournamentBadge.name}
                            src={tournamentBadge.icon}
                            variant="rounded"
                            sx={{ width: 86, height: 40 }}
                          />
                        </Tooltip>
                      )
                    )
                  : ""}
              </Stack>
            </Stack>
          </Stack>
          {/* Right user info display (global/country ranking) */}
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-end"
            spacing={1}
            padding={2}
            width="50%"
          >
            <Typography variant="h5" fontWeight="bold">
              Overall Ranking
            </Typography>
            {/* TODO: add a method for fetching global & country rank from the backend */}
            <Stack direction="row">
              <Typography variant="h6">
                #
                {userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]
                  .globalLeaderboardRank ?? "N/A"}
              </Typography>
              <PublicIcon sx={{ width: 36, height: 36 }} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">
                #
                {userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]
                  .countryLeaderboardRank ?? "N/A"}
              </Typography>
              <Box
                component="img"
                width={36}
                height={36}
                alt="flag-image"
                src={getFlagUrl(userProfile.country)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="column" spacing={2}>
        <ProfileSelectionBar
          gameMode={gameMode}
          relaxMode={relaxMode}
          setGameMode={setGameMode}
          setRelaxMode={setRelaxMode}
        />
        <Divider />
        <Stack direction="row" spacing={2} justifyContent="space-evenly">
          <Box sx={{ width: 1 / 3 }}>
            <UserProfileStats
              statsData={
                userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]
              }
              followers={userProfile.followers}
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ width: 2 / 3 }}>
            {/* TODO: figure out how to model rank vs. pp/score/etc. */}
            <Stack
              direction="row"
              justifyContent="end"
              spacing={1}
              paddingBottom={1}
            >
              <Button
                variant={
                  profileHistoryType === ProfileHistoryType.GlobalRank
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  setProfileHistoryType(ProfileHistoryType.GlobalRank)
                }
              >
                Global Rank
              </Button>
              <Button
                variant={
                  profileHistoryType === ProfileHistoryType.CountryRank
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  setProfileHistoryType(ProfileHistoryType.CountryRank)
                }
              >
                Country Rank
              </Button>
              <Button
                variant={
                  profileHistoryType === ProfileHistoryType.PP
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setProfileHistoryType(ProfileHistoryType.PP)}
              >
                PP
              </Button>
            </Stack>
            <UserProfileHistoryGraph
              userId={profileUserId}
              type={profileHistoryType}
              gameMode={gameMode}
              relaxMode={relaxMode}
            />
          </Box>
        </Stack>
        <Divider />
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
      </Stack>
    </>
  )
}
