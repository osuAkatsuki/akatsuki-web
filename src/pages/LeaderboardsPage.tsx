import { Stack, Typography } from "@mui/material"

import { GlobalUserLeaderboard } from "../components/GlobalUserLeaderboard"
import { useUiStateContext } from "../context/ui-state"

export const LeaderboardsPage = () => {
  const { setUiState } = useUiStateContext()

  setUiState({ navbarVariant: "dark" })

  return (
    <>
      <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
        <Typography variant="h4">Leaderboards</Typography>
        <GlobalUserLeaderboard />
      </Stack>
    </>
  )
}
