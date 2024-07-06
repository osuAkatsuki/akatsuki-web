import { Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import Stack from "@mui/material/Stack"
import { useIdentityContext } from "../context"

export const HomePage = () => {
  const { identity } = useIdentityContext()

  return (
    <Stack
      direction="column"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2">Welcome to Akatsuki</Typography>
      <Typography variant="h4">
        The largest competitive osu! private server
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        {identity ? (
          <Link to={`/u/${identity.userId}`}>
            <Button variant="contained" color="primary">
              <Typography variant="h6">My Profile</Typography>
            </Button>
          </Link>
        ) : (
          <Link to="/register">
            <Button variant="contained" color="primary">
              <Typography variant="h6">Sign Up</Typography>
            </Button>
          </Link>
        )}
        <Link to="/leaderboards">
          <Button variant="contained" color="secondary">
            <Typography variant="h6">Leaderboards</Typography>
          </Button>
        </Link>
      </Stack>
    </Stack>
  )
}
