import { useParams } from "react-router-dom"
import { Typography, Paper, Alert, Avatar } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import PublicIcon from "@mui/icons-material/Public"
import WifiIcon from "@mui/icons-material/Wifi"
import WifiOffIcon from "@mui/icons-material/WifiOff"
import { GameMode, RelaxMode } from "../gameModes"
import { getFlagUrl } from "../utils/countries"
import { ProfileSelectionBar } from "../components/ProfileSelectionBar"
import {
  fetchUserScores,
  UserScoresResponse,
} from "../adapters/akatsuki-api/userScores"
import { fetchUser, UserFullResponse } from "../adapters/akatsuki-api/users"
import { useIdentityContext } from "../context"
import { UserProfileHistoryGraph } from "../components/UserProfileHistoryGraph"
import { UserProfileStats } from "../components/UserProfileStats"
import { UserProfileScores } from "../components/UserProfileScores"

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
  const { identity } = useIdentityContext()
  const { userId: profileUserId } = useParams()

  // TODO: better error handling; each component in the page
  // may be able to raise multiple errors; one global one won't cut it
  const [error, setError] = useState("")

  const [userProfile, setUserProfile] = useState<UserFullResponse | null>(null)
  const rankHistoryData = null // TODO
  const isOnline = true // TODO

  const [gameMode, setGameMode] = useState(GameMode.Standard)
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla)

  const [bestScores, setBestScores] = useState<UserScoresResponse | null>(null)
  const [recentScores, setRecentScores] = useState<UserScoresResponse | null>(
    null
  )

  useEffect(() => {
    ;(async () => {
      if (!profileUserId) return

      try {
        const usersResponse = await fetchUser(parseInt(profileUserId))
        setUserProfile(usersResponse)
      } catch (e: any) {
        setError("Failed to fetch user profile data from server")
        return
      }
    })()
  }, [profileUserId])

  useEffect(() => {
    if (!profileUserId) return
    ;(async () => {
      try {
        const playerBestScores = await fetchUserScores({
          type: "best",
          mode: gameMode,
          p: 1, // todo pagination
          l: 50,
          rx: relaxMode,
          id: parseInt(profileUserId),
        })
        setBestScores(playerBestScores)
      } catch (e: any) {
        setError("Failed to fetch best scores data from server")
        return
      }
    })()
  }, [profileUserId, gameMode, relaxMode])

  useEffect(() => {
    if (!profileUserId) return
    ;(async () => {
      try {
        const playerRecentScores = await fetchUserScores({
          type: "recent",
          mode: gameMode,
          p: 1, // todo pagination
          l: 50,
          rx: relaxMode,
          id: parseInt(profileUserId),
        })
        setRecentScores(playerRecentScores)
      } catch (e: any) {
        setError("Failed to fetch recent scores data from server")
        return
      }
    })()
  }, [profileUserId, gameMode, relaxMode])

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
  if (!userProfile || !bestScores || !recentScores) {
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
                    src="https://a.akatsuki.gg/1001"
                    sx={{ width: 124, height: 124 }}
                  />
                  <Stack direction="column">
                    <Typography variant="h5">{userProfile.username}</Typography>
                    {isOnline ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WifiIcon sx={{ width: 20, height: 20 }} />
                        <Typography variant="subtitle1">Online</Typography>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WifiOffIcon sx={{ width: 20, height: 20 }} />
                        <Typography variant="subtitle1">Offline</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
                <Stack
                  direction="column"
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{ p: 2 }}
                >
                  {/* TODO: add a method for fetching global & country rank from the backend */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4">
                      #
                      {userProfile.stats[relaxMode][modeToStatsIndex(gameMode)]
                        .globalLeaderboardRank ?? "N/A"}
                    </Typography>
                    <PublicIcon sx={{ width: 36, height: 36 }} />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4">
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
            <Box sx={{ width: 2 / 3 }}>
              {/* TODO: figure out how to model rank vs. pp/score/etc. */}
              <UserProfileHistoryGraph rankHistoryData={rankHistoryData} />
            </Box>
          </Stack>
          <Box>
            <UserProfileScores
              scoresData={bestScores.scores}
              title="Best Scores"
            />
          </Box>
          <Box>
            <UserProfileScores
              scoresData={recentScores.scores}
              title="Recent Scores"
            />
          </Box>
        </Stack>
      </Paper>
    </>
  )
}
