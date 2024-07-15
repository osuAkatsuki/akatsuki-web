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
  AppBar,
  Toolbar,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { FavoriteOutlined } from "@mui/icons-material"
import { removeIdentityFromLocalStorage, useIdentityContext } from "../context"
import { logout } from "../adapters/akatsuki-api/authentication"
import { useEffect, useMemo, useState } from "react"
import { AkatsukiLogo } from "./images/logos/AkatsukiLogo"
import {
  searchUsers,
  SingleUserSearchResult,
} from "../adapters/akatsuki-api/search"
import { UserPrivileges } from "../privileges"

const NavButton = ({
  to,
  label,
  sx = {},
}: {
  to: string
  label: string
  sx?: any
}) => (
  <Box sx={sx} maxWidth="lg">
    <Link to={to}>
      <Button>
        <Typography variant="subtitle1">{label}</Typography>
      </Button>
    </Link>
  </Box>
)

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Left Menu */}
          <Link to="/">
            <Button>
              <Box width={146.25} height={29.97}>
                <AkatsukiLogo />
              </Box>
            </Button>
          </Link>
          <Divider orientation="vertical" flexItem />
          <NavButton to="/leaderboards" label="Leaderboards" />
          {/* <Link to="/information">
                <Button>
                  <Typography variant="subtitle1">Information</Typography>
                </Button>
              </Link> */}
          <NavButton
            to={process.env.REACT_APP_PUBLIC_DISCORD_INVITE_URL!}
            label="Discord"
            sx={{ flexGrow: 1 }}
          />
          {/* Right Menu */}
          {identity !== null &&
          identity.privileges & UserPrivileges.ADMIN_ACCESS_RAP ? (
            <NavButton
              to={process.env.REACT_APP_ADMIN_PANEL_HOME_URL!}
              label="Admin Panel"
            />
          ) : null}

          <Autocomplete
            id="user-search"
            sx={{ width: 225 }}
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
              <NavButton to="/login" label="Login" />
              <NavButton to="/register" label="Register" />
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
