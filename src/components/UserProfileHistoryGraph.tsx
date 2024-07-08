import { useEffect, useMemo, useState } from "react"
import { Line } from "react-chartjs-2"
import { GameMode, RelaxMode } from "../gameModes"
import {
  fetchUserProfileHistory,
  ProfileHistoryType,
  ProfileHistoryResponse,
  ProfileHistoryCapture,
  captureTypeToDisplay,
} from "../adapters/akatsuki-api/profileHistory"
import { Alert, Typography } from "@mui/material"

export const UserProfileHistoryGraph = ({
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
