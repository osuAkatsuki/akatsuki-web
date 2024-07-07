import { useEffect, useMemo, useState } from "react"
import { AxisOptions, Chart, Datum, Series } from "react-charts"
import { GameMode, RelaxMode } from "../gameModes"
import {
  fetchUserProfileHistory,
  ProfileHistoryCapture,
  ProfileHistoryResponse,
} from "../adapters/akatsuki-api/profileHistory"
import { Alert } from "@mui/material"

export const UserProfileHistoryGraph = ({
  userId,
  type,
  gameMode,
  relaxMode,
}: {
  userId: number
  type: "rank" | "pp"
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
          type: type,
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

  const data = [
    {
      label: "Profile History",
      data: profileHistoryResponse
        ? profileHistoryResponse.captures.map(
            (capture: ProfileHistoryCapture) => ({
              date: capture.capturedAt,
              performance: capture.overall,
            })
          )
        : [],
    },
  ]

  const primaryAxis = useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.date as unknown as Date,
      elementType: "line",
      scaleType: "time",
    }),
    []
  )

  const secondaryAxes = useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.performance,
        elementType: "line",
        scaleType: "linear",
      },
    ],
    []
  )

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }
  return (
    <>
      <Chart options={{ data, primaryAxis, secondaryAxes }} />
    </>
  )
}
