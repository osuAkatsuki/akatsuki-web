import {
  Typography,
  Button,
  Stack,
  Container,
  Input,
  Paper,
  Divider,
  IconButton,
} from "@mui/material"
import { Link } from "react-router-dom"
import { FavoriteOutlined } from "@mui/icons-material"
import { removeIdentityFromLocalStorage, useIdentityContext } from "../context"
import { logout } from "../adapters/akatsuki-api/authentication"
import { useState } from "react"

export default function Navbar() {
  const { identity, setIdentity } = useIdentityContext()

  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    if (identity !== null) {
      console.warn("User attempted a logout without being logged in")
      setIdentity(null)
      removeIdentityFromLocalStorage()
      return
    }
    try {
      await logout()
    } catch (e: any) {
      console.error("Failed to logout on API:", e)
    }
    removeIdentityFromLocalStorage()
    setIdentity(null)
  }

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value)
    // TODO: make an API call to search for the users,
    // then display a popup/dropdown of the N most relevant
    // players found.
    // TODO: consider allowing for searching for more than
    // just users, e.g. beatmaps, clans, etc.
  }

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
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
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
              <Input
                placeholder="Looking for someone?"
                // TODO: debounce input
                onChange={handleSearch}
              />
              {identity !== null ? (
                <>
                  {/* TODO: dropdown when searching for users */}
                  {/* https://mui.com/material-ui/react-autocomplete/#search-as-you-type */}
                  {/* import { debounce } from '@mui/material/utils'; */}
                  <Link to="/support">
                    <IconButton aria-label="support">
                      <FavoriteOutlined sx={{ color: "#db2828" }} />
                    </IconButton>
                  </Link>

                  {/* TODO: put this behind a profile submenu */}
                  <Button onClick={handleLogout}>
                    <Typography variant="subtitle1">Logout</Typography>
                  </Button>
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
