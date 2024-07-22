import { useParams } from "react-router-dom"
import {
  Typography,
  Alert,
  Divider,
  useMediaQuery,
  Container,
} from "@mui/material"
import DefaultProfileBanner from "../components/images/banners/default_profile.png"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { GameMode, RelaxMode } from "../gameModes"
import { fetchUser, UserFullResponse } from "../adapters/akatsuki-api/users"
import { useTheme } from "@mui/material/styles"
import { ProfileHistoryType } from "../adapters/akatsuki-api/profileHistory"
import { modeToStatsIndex } from "../scores"
import { ProfileIdentityCard } from "../components/profile/ProfileIdentityCard"
import { ProfileActivityDatesCard } from "../components/profile/ProfileActivityDatesCard"
import { ProfileRelationshipCard } from "../components/profile/ProfileRelationshipCard"
import { GamemodeSelectionBar } from "../components/profile/GamemodeSelectionBar"
import { ProfileTournamentBadgesCard } from "../components/profile/ProfileTournamentBadgesCard"
import { ProfileStatsCard } from "../components/profile/ProfileStatsCard"
import { ProfileLevelCard } from "../components/profile/ProfileLevelCard"
import { ProfileClanCard } from "../components/profile/ProfileClanCard"
import { ProfileUserpageCard } from "../components/profile/ProfileUserpageCard"
import { ProfileHistoryCard } from "../components/profile/ProfileHistoryCard"
import { ProfileScoresCard } from "../components/profile/ProfileScoresCard"

export const ProfilePage = () => {
  const queryParams = useParams()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.up("xs"))

  const profileUserId = parseInt(queryParams["userId"] ?? "0")

  const [error, setError] = useState("")

  const [userProfile, setUserProfile] = useState<UserFullResponse | null>(null)
  const [profileHistoryType, setProfileHistoryType] =
    useState<ProfileHistoryType>(ProfileHistoryType.GlobalRank)
  // const [isOnline, setIsOnline] = useState(false)

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

  // useEffect(() => {
  //   ;(async () => {
  //     const response = await userIsOnline({ userId: profileUserId })
  //     setIsOnline(response.result)
  //   })()
  // })

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
            <ProfileIdentityCard userProfile={userProfile} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
              px={3}
              py={2}
              spacing={{ xs: 1, sm: 0 }}
            >
              <ProfileActivityDatesCard userProfile={userProfile} />
              <ProfileRelationshipCard followers={userProfile.followers} />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box width="100%" bgcolor="#211D35" color="#FFFFFF80">
        <Container>
          <GamemodeSelectionBar
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
                <ProfileTournamentBadgesCard badges={userProfile.tbadges} />
              )}
              <ProfileStatsCard statsData={modeStats} />
              <Divider sx={{ my: 2 }} />
              <ProfileLevelCard level={modeStats.level} />
              {userProfile.clan.id !== 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <ProfileClanCard clan={userProfile.clan} />
                </>
              )}
            </Box>

            {!isMobile && <Divider orientation="vertical" flexItem />}

            {/* Right Side (Profile History, Scores, etc.) */}
            <Box width={{ xs: "100%", sm: "66.67%" }}>
              <ProfileUserpageCard userProfile={userProfile} />

              <ProfileHistoryCard
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
