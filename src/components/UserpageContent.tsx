import { useEffect, useState } from "react"
import { fetchUserpage, UserpageResponse } from "../adapters/akatsuki-api/users"
import { Alert, Box, Paper, Typography } from "@mui/material"

export const UserpageContent = ({ userId }: { userId: number }) => {
  const [userpageResponse, setUserpageResponse] =
    useState<UserpageResponse | null>(null)

  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetchUserpage({ id: userId })
        setUserpageResponse(response)
      } catch (e: any) {
        setError(e.message)
        return
      }
    })()
  }, [userId])

  if (error) {
    return <Alert>{error}</Alert>
  }

  if (!userpageResponse) {
    return null
  }

  return (
    <>
      <Box>
        {/* Avatar / Name / Online Status */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="body1">
            {userpageResponse.userpage_compiled}
          </Typography>
        </Paper>
      </Box>
    </>
  )
}
