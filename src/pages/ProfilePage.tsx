import {
  Alert,
  Container,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ProfileHistoryType } from "../adapters/akatsuki-api/profileHistory"
import {
  fetchUserFriendsWith,
  RelationshipType,
} from "../adapters/akatsuki-api/userRelationships"
import { fetchUser, UserFullResponse } from "../adapters/akatsuki-api/users"
import { GamemodeSelectionBar } from "../components/GamemodeSelectionBar"
import DefaultProfileBanner from "../components/images/banners/default_profile.png"
import { ProfileActivityDatesCard } from "../components/profile/ProfileActivityDatesCard"
import { ProfileClanCard } from "../components/profile/ProfileClanCard"
import { ProfileHistoryCard } from "../components/profile/ProfileHistoryCard"
import { ProfileIdentityCard } from "../components/profile/ProfileIdentityCard"
import { ProfileLevelCard } from "../components/profile/ProfileLevelCard"
import { ProfileRelationshipCard } from "../components/profile/ProfileRelationshipCard"
import { ProfileScoresCard } from "../components/profile/ProfileScoresCard"
import { ProfileStatsCard } from "../components/profile/ProfileStatsCard"
import { ProfileTournamentBadgesCard } from "../components/profile/ProfileTournamentBadgesCard"
import { ProfileUserpageCard } from "../components/profile/ProfileUserpageCard"
import { useIdentityContext } from "../context/identity"
import { GameMode, RelaxMode } from "../gameModes"
import { modeToStatsIndex } from "../scores"

const getUserIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || "")
  if (isNaN(userId)) {
    // TODO: do API lookup
    userId = 0
  }
  return userId
}

export const ProfilePage = () => {
  const queryParams = useParams()
  const { identity } = useIdentityContext()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.up("xs"))

  const profileUserId = getUserIdFromQueryParams(queryParams["userId"])

  const [error, setError] = useState("")

  const [userProfile, setUserProfile] = useState<UserFullResponse | null>(null)
  const [profileHistoryType, setProfileHistoryType] =
    useState<ProfileHistoryType>(ProfileHistoryType.GlobalRank)
  const [relationship, setRelationship] = useState(RelationshipType.NotFriend)

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
        console.error("Failed to fetch user profile data from server")
        setError("Failed to fetch user profile data from server")
        return
      }
    })()
  }, [profileUserId])

  useEffect(() => {
    ;(async () => {
      if (!profileUserId || !identity) {
        setRelationship(RelationshipType.NotFriend)
        return
      }

      try {
        const response = await fetchUserFriendsWith({ id: profileUserId })
        if (response.mutual) {
          setRelationship(RelationshipType.Mutual)
        } else if (response.friend) {
          setRelationship(RelationshipType.Friend)
        } else {
          setRelationship(RelationshipType.NotFriend)
        }
      } catch (e: any) {
        console.error(
          "Failed to fetch user relationship information from server"
        )
        setRelationship(RelationshipType.NotFriend)
        return
      }
    })()
  }, [profileUserId, identity])

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
    return <></>
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
              <ProfileRelationshipCard
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                relationship={relationship}
                setRelationship={setRelationship}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        width="100%"
        bgcolor="#211D35"
        color="#FFFFFF80"
        /* NOTE: increase zindex here to put the profile graph below this */
        position="relative"
        zIndex={2}
      >
        <Container>
          <GamemodeSelectionBar
            gameMode={gameMode}
            setGameMode={setGameMode}
            relaxMode={relaxMode}
            setRelaxMode={setRelaxMode}
          />
        </Container>
      </Box>
      <Container disableGutters sx={{ backgroundColor: "#191527" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-evenly"
        >
          {/* Left Side (Stats, Clan, etc.) */}
          <Box
            width={{ xs: "100%", sm: "33.33%" }}
            sx={{ background: "rgba(21, 18, 35, 1)" }}
          >
            <Box p={4}>
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
          </Box>

          {!isMobile && <Divider flexItem orientation="vertical" />}

          {/* Right Side (Profile History, Scores, etc.) */}
          <Box width={{ xs: "100%", sm: "66.67%" }}>
            <ProfileUserpageCard userProfile={userProfile} />
            <Box
              borderRadius={2}
              p={2}
              pt={3}
              mt={-1}
              sx={{ background: "rgba(30, 27, 47, 1)" }}
            >
              <ProfileHistoryCard
                userProfile={userProfile}
                gameMode={gameMode}
                relaxMode={relaxMode}
                profileHistoryType={profileHistoryType}
                setProfileHistoryType={setProfileHistoryType}
              />
            </Box>
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
      </Container>
    </Box>
  )
}
