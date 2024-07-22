import { Typography, Alert, Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import PublicIcon from "@mui/icons-material/Public"
import { GameMode, RelaxMode } from "../../gameModes"
import { getFlagUrl } from "../../utils/countries"
import { UserFullResponse, UserStats } from "../../adapters/akatsuki-api/users"
import {
  captureTypeToDisplay,
  fetchUserProfileHistory,
  ProfileHistoryCapture,
  ProfileHistoryResponse,
  ProfileHistoryType,
} from "../../adapters/akatsuki-api/profileHistory"
import { formatDecimal, formatNumber } from "../../utils/formatting"
import { Line } from "react-chartjs-2"
import { modeToStatsIndex } from "../../scores"

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

const ProfileHistoryGraph = ({
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

export const ProfileHistoryCard = ({
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
      <ProfileHistoryGraph
        userId={userProfile.id}
        type={profileHistoryType}
        gameMode={gameMode}
        relaxMode={relaxMode}
      />
    </>
  )
}
