import { Stack, Typography } from "@mui/material"

import { GlobalUserLeaderboard } from "../components/GlobalUserLeaderboard"

export const LeaderboardsPage = () => {
  return (
    <>
      <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
        <Typography variant="h4">Leaderboards</Typography>
        <GlobalUserLeaderboard />
      </Stack>
    </>
  )
}
