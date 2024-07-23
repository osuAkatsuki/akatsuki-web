import { Typography, Alert, Button, Divider } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { GameMode, RelaxMode } from "../../gameModes"
import { UserFullResponse, UserStats } from "../../adapters/akatsuki-api/users"
import {
  captureTypeToDisplay,
  fetchUserProfileHistory,
  ProfileHistoryCapture,
  ProfileHistoryResponse,
  ProfileHistoryType,
} from "../../adapters/akatsuki-api/profileHistory"
import { formatDecimal } from "../../utils/formatting"
import { Line as LineChart } from "react-chartjs-2"
import { modeToStatsIndex } from "../../scores"
import { FlagIcon, GlobalIcon } from "../DestinationIcons"

const getChartOptions = (chartType: ProfileHistoryType) => {
  const useReverseYAxis = [
    ProfileHistoryType.CountryRank,
    ProfileHistoryType.GlobalRank,
  ].includes(chartType)

  return {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        display: false,
        reverse: useReverseYAxis,
        type: "linear",
        ticks: {
          precision: 0,
        },
      },
      x: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
  } as const
}

const ActiveUnderline = ({ isActive }: { isActive: boolean }) => {
  return (
    <Box minHeight="4px">
      {isActive && (
        <Divider
          sx={{
            height: "4px",
            borderRadius: "2px",
            backgroundImage: `linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)`,
          }}
        />
      )}
    </Box>
  )
}

const ProfileHistoryTypeSelectionButton = ({
  onClick,
  displayValue,
  isActive,
  icon,
  textSuffix,
}: {
  onClick?: () => void
  displayValue: string | null
  isActive: boolean
  icon?: JSX.Element
  textSuffix?: string
}) => {
  return (
    <Button
      variant="text"
      onClick={onClick}
      sx={{
        color: "white",
        opacity: isActive ? "100%" : "60%",
        textTransform: "none",
      }}
    >
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
          {icon ?? null}
          <Typography variant="h6">{displayValue ?? " N/A"}</Typography>
          {textSuffix ? (
            <Typography variant="h6" fontWeight="lighter">
              {textSuffix}
            </Typography>
          ) : null}
        </Stack>
        <ActiveUnderline isActive={isActive} />
      </Stack>
    </Button>
  )
}

const ProfileHistoryGraphNavbar = ({
  userStats,
  country,
  profileHistoryType,
  setProfileHistoryType,
}: {
  userStats: UserStats
  country: string
  profileHistoryType: ProfileHistoryType
  setProfileHistoryType: (type: ProfileHistoryType) => void
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent={{ sm: "space-between" }}
    >
      <Stack direction="row" spacing={1} justifyContent={{ xs: "center" }}>
        <ProfileHistoryTypeSelectionButton
          onClick={() => setProfileHistoryType(ProfileHistoryType.GlobalRank)}
          displayValue={`#${userStats.globalLeaderboardRank}`}
          isActive={profileHistoryType === ProfileHistoryType.GlobalRank}
          icon={<GlobalIcon height={32} width={32} />}
        />
        <ProfileHistoryTypeSelectionButton
          onClick={() => setProfileHistoryType(ProfileHistoryType.CountryRank)}
          displayValue={`#${userStats.countryLeaderboardRank}`}
          isActive={profileHistoryType === ProfileHistoryType.CountryRank}
          icon={<FlagIcon country={country} height={32} width={32} />}
        />
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={{ xs: 1, sm: 2 }}>
        <ProfileHistoryTypeSelectionButton
          onClick={() => setProfileHistoryType(ProfileHistoryType.PP)}
          displayValue={`${userStats.pp}`}
          isActive={profileHistoryType === ProfileHistoryType.PP}
          textSuffix="pp"
        />
        {/* TODO: profile history data collection for accuracy */}

        <ProfileHistoryTypeSelectionButton
          onClick={
            // TODO: support accuracy history
            () => undefined
          }
          displayValue={`${formatDecimal(userStats.accuracy)}%`}
          isActive={profileHistoryType === ProfileHistoryType.Accuracy}
          textSuffix="accuracy"
        />
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
        borderColor: "#ffffff",
        tension: 0.5,
        borderWidth: 6,
      },
    ],
  }

  return (
    <Box py={2}>
      <LineChart data={chartData} options={getChartOptions(type)} />
    </Box>
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
        profileHistoryType={profileHistoryType}
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
