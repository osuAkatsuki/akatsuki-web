import {
  Typography,
  Button,
  Stack,
  Container,
  TextField,
  Paper,
  Divider,
  IconButton,
  Autocomplete,
  debounce,
  Box,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { FavoriteOutlined } from "@mui/icons-material"
import {
  removeIdentityFromLocalStorage,
  useIdentityContext,
} from "../context/identity"
import { logout } from "../adapters/akatsuki-api/authentication"
import { useEffect, useMemo, useState } from "react"
import { AkatsukiLogo } from "./images/logos/AkatsukiLogo"
import {
  searchUsers,
  SingleUserSearchResult,
} from "../adapters/akatsuki-api/search"
import { UserPrivileges } from "../privileges"

export default function Navbar() {
  const navigate = useNavigate()
  const { identity, setIdentity } = useIdentityContext()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryOptions, setSearchQueryOptions] = useState<
    SingleUserSearchResult[] | null
  >([])
  const [searchQueryValue, setSearchQueryValue] =
    useState<SingleUserSearchResult | null>(null)

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

  const searchForUsers = useMemo(
    () =>
      debounce((query: string) => {
        searchUsers({ query }).then((response) => {
          setSearchQueryOptions(response.users)
        })
      }, 400),
    []
  )

  useEffect(() => {
    if (!searchQuery) {
      setSearchQueryOptions([])
      return
    }

    searchForUsers(searchQuery)
  }, [searchQuery, searchForUsers])

  return (
    <>
      <Paper elevation={1} square sx={{ bgcolor: "transparent" }}>
        <Container>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            minHeight={5}
            p={1.25}
          >
            {/* Left Navbar */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Link to="/">
                <Button>
                  <Box width={146.25} height={29.97}>
                    <AkatsukiLogo />
                  </Box>
                </Button>
              </Link>
              <Divider orientation="vertical" flexItem />
              <Link to="/leaderboards">
                <Button>
                  <Typography variant="subtitle1">Leaderboards</Typography>
                </Button>
              </Link>
              {/* <Link to="/information">
                <Button>
                  <Typography variant="subtitle1">Information</Typography>
                </Button>
              </Link> */}
              <Link to={process.env.REACT_APP_PUBLIC_DISCORD_INVITE_URL!}>
                <Button>
                  <Typography variant="subtitle1">Discord</Typography>
                </Button>
              </Link>
            </Stack>
            {/* Right Navbar */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {identity !== null &&
              identity.privileges & UserPrivileges.ADMIN_ACCESS_RAP ? (
                <Link to={process.env.REACT_APP_ADMIN_PANEL_HOME_URL!}>
                  <Button>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Admin Panel
                    </Typography>
                  </Button>
                </Link>
              ) : null}

              <Autocomplete
                id="user-search"
                sx={{ width: 225 }} // TODO: does this scale?
                filterOptions={(x) => x}
                value={searchQueryValue}
                options={searchQueryOptions ?? []}
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) =>
                  option.username === value.username
                }
                renderInput={(params) => {
                  return <TextField {...params} label="Looking for someone?" />
                }}
                onInputChange={(event, newInputValue: string) =>
                  setSearchQuery(newInputValue)
                }
                onChange={(event, newValue) => {
                  if (newValue === null) return
                  setSearchQueryValue(newValue)
                  setSearchQueryOptions([newValue])
                  navigate(`/u/${newValue.id}`)
                }}
              />
              {identity !== null ? (
                <>
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
