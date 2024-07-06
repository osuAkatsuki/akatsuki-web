import { Typography, Button, Stack, Container } from "@mui/material"
import { Link } from "react-router-dom"
import { Paper, Divider, IconButton } from "@mui/material"
import { FavoriteOutlined } from "@mui/icons-material"
import { useIdentityContext } from "../context"

export default function Navbar() {
  const { identity } = useIdentityContext()

  // const handleLogout = async () => {
  //   if (identity !== null) {
  //     console.warn("User attempted a logout without being logged in")
  //     return
  //   }
  //   // await logout()
  //   removeIdentityFromLocalStorage()
  //   setIdentity(null)
  // }

  return (
    <>
      <Paper elevation={1} square>
        <Container>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              p: 1.25,
            }}
          >
            {/* Left Navbar */}
            <Stack direction="row" spacing={1} sx={{ display: "flex" }}>
              <Link to="/">
                <Button>
                  <Typography variant="subtitle1">Akatsuki</Typography>
                </Button>
              </Link>
              <Divider orientation="vertical" flexItem />
              <Link to="/leaderboards">
                <Button>
                  <Typography variant="subtitle1">Leaderboards</Typography>
                </Button>
              </Link>
            </Stack>
            {/* Right Navbar */}
            <Stack direction="row" spacing={1}>
              {/* TODO: add user search bar */}
              {identity !== null ? (
                <>
                  {/* TODO: player search bar with autocomplete functionality */}
                  {/* https://mui.com/material-ui/react-autocomplete/#search-as-you-type */}
                  {/* import { debounce } from '@mui/material/utils'; */}
                  <Link to="/support">
                    {/* TODO: heart emoji */}
                    <IconButton aria-label="support">
                      <FavoriteOutlined sx={{ color: "#db2828" }} />
                    </IconButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button>
                      <Typography variant="subtitle1">Login</Typography>
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>
                      <Typography variant="subtitle1">Register</Typography>
                    </Button>
                  </Link>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Paper>
    </>
  )
}
