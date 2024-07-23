import {
  Typography,
  Button,
  Stack,
  Container,
  TextField,
  Divider,
  IconButton,
  Autocomplete,
  debounce,
  Box,
} from "@mui/material"
import { Link, useLocation, useNavigate } from "react-router-dom"
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

const PAGES_WITH_VISIBLE_OUTLINE = ["/"]

const shouldUseVisibleOutline = (pagePathName: string) =>
  PAGES_WITH_VISIBLE_OUTLINE.includes(pagePathName)

export default function Navbar() {
  const navigate = useNavigate()
  const { identity, setIdentity } = useIdentityContext()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryOptions, setSearchQueryOptions] = useState<
    SingleUserSearchResult[] | null
  >([])
  const [searchQueryValue, setSearchQueryValue] =
    useState<SingleUserSearchResult | null>(null)

  const location = useLocation()
  const useVisibleOutline = shouldUseVisibleOutline(location.pathname)

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
      <Box
        width="100%"
        position={{ sm: "absolute" }}
        top={0}
        left={0}
        // In line with https://mui.com/material-ui/customization/z-index/
        zIndex={900}
        sx={{
          background: useVisibleOutline
            ? "linear-gradient(0deg, rgba(17, 14, 27, 0.6) 0%, rgba(17, 14, 27, 0.528) 100%)"
            : "transparent",
        }}
      >
        <Container>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            minHeight={5}
            py={1.25}
            spacing={{ xs: 1, sm: 0 }}
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
              <Link to="/">
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="subtitle1">Home</Typography>
                </Button>
              </Link>
              <Link to="/leaderboards">
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="subtitle1">Leaderboards</Typography>
                </Button>
              </Link>
              <Link to="/about">
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="subtitle1">About</Typography>
                </Button>
              </Link>
              <Link to={process.env.REACT_APP_DISCORD_INVITE_URL}>
                <Button sx={{ color: "white", textTransform: "none" }}>
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
                <Link to={process.env.REACT_APP_ADMIN_PANEL_HOME_URL}>
                  <Button sx={{ color: "white", textTransform: "none" }}>
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
                  <Button
                    onClick={handleLogout}
                    sx={{ color: "white", textTransform: "none" }}
                  >
                    <Typography variant="subtitle1">Logout</Typography>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button sx={{ color: "white", textTransform: "none" }}>
                      <Typography variant="subtitle1">Login</Typography>
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button sx={{ color: "white", textTransform: "none" }}>
                      <Typography variant="subtitle1">Register</Typography>
                    </Button>
                  </Link>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  )
}
