import { useParams } from "react-router-dom"
import { Typography, Paper, Alert, Avatar, Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import PublicIcon from "@mui/icons-material/Public"
import WifiIcon from "@mui/icons-material/Wifi"
import WifiOffIcon from "@mui/icons-material/WifiOff"
import { GameMode, RelaxMode } from "../gameModes"
import { getFlagUrl } from "../utils/countries"
import { ProfileSelectionBar } from "../components/ProfileSelectionBar"
import { fetchUser, UserFullResponse } from "../adapters/akatsuki-api/users"
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
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Stack direction="column" spacing={2}>
          <Box>
            {/* Avatar / Name / Online Status */}
            <Paper elevation={3}>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                  <Avatar
                    alt="user-avatar"
                    src={`https://a.akatsuki.gg/${userProfile.id}`}
                    variant="square"
                    sx={{ width: 124, height: 124 }}
                  />
                  <Stack direction="column">
                    <Typography fontWeight="bold" variant="h5">
                      {userProfile.username}
                    </Typography>
                    {isOnline ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WifiIcon
                          sx={{ width: 20, height: 20 }}
                          color="success"
                        />
                        <Typography variant="subtitle2">Online</Typography>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WifiOffIcon
                          sx={{ width: 20, height: 20 }}
                          color="error"
                        />
                        <Typography variant="subtitle2">Offline</Typography>
                      </Stack>
                    )}
                    <Typography variant="subtitle2">
                      Last seen:{" "}
                      {userProfile !== null
                        ? moment(userProfile.latestActivity).fromNow()
                        : "N/A"}
                    </Typography>
                    <Typography variant="subtitle2">
                      Registered:{" "}
                      {userProfile !== null
                        ? moment(userProfile.registeredOn).fromNow()
                        : "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
                {/* Global & Country Player Ranking */}
                <Stack
                  direction="column"
                  justifyContent="space-evenly"
                  alignItems="flex-end"
                  spacing={2}
                  padding={2}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Player Ranking
                  </Typography>
                  {/* TODO: add a method for fetching global & country rank from the backend */}
                  <Stack direction="row" spacing={1} alignItems="center">
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
            </Paper>
          </Box>
          <ProfileSelectionBar
            gameMode={gameMode}
            relaxMode={relaxMode}
            setGameMode={setGameMode}
            setRelaxMode={setRelaxMode}
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-evenly" }}
          >
            <Box sx={{ width: 1 / 3 }}>
              <UserProfileStats
                statsData={
                  userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]
                }
              />
            </Box>
            <Box sx={{ width: 2 / 3 }} overflow="auto">
              {/* TODO: figure out how to model rank vs. pp/score/etc. */}
              <Stack direction="row" justifyContent="end" spacing={1}>
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
          <Box>
            <UserProfileScores
              scoresType="best"
              userId={profileUserId}
              gameMode={gameMode}
              relaxMode={relaxMode}
              title="Best Scores"
            />
          </Box>
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
      </Paper>
    </>
  )
}
