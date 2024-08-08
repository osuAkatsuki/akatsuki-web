import * as amplitude from "@amplitude/analytics-browser"
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  debounce,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Cookies from "js-cookie"
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { logout } from "../adapters/akatsuki-api/authentication"
import {
  searchUsers,
  SingleUserSearchResult,
} from "../adapters/akatsuki-api/search"
import {
  Identity,
  removeIdentityFromLocalStorage,
  useIdentityContext,
} from "../context/identity"
import { UserPrivileges } from "../privileges"
import { AkatsukiLogo } from "./images/logos/AkatsukiLogo"

const PAGES_WITH_VISIBLE_OUTLINE = ["/"]

const shouldUseVisibleOutline = (pagePathName: string) =>
  PAGES_WITH_VISIBLE_OUTLINE.includes(pagePathName)

export const ProfileSettingsMenu = ({
  identity,
  setIdentity,
}: {
  identity: Identity
  setIdentity: (identity: Identity | null) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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
    Cookies.remove("X-Ripple-Token")
    amplitude.reset()
    removeIdentityFromLocalStorage()
    setIdentity(null)
  }

  return (
    <>
      <Button
        aria-label="profile-settings-button"
        id="profile-settings-button"
        aria-controls={open ? "profile-settings-button" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ textTransform: "none" }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ color: "white" }}>
            {identity.username}
          </Typography>
          <Avatar
            alt="user-avatar"
            src={`https://a.akatsuki.gg/${identity.userId}`}
            variant="rounded"
            sx={{ width: 36, height: 36, borderRadius: "16px" }}
          />
        </Stack>
      </Button>
      <Menu
        id="profile-settings-menu"
        MenuListProps={{
          "aria-labelledby": "profile-settings-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          component={Link}
          onClick={handleClose}
          to={`/u/${identity.userId}`}
        >
          <Typography variant="body1">Profile</Typography>
        </MenuItem>
        {identity.privileges & UserPrivileges.ADMIN_ACCESS_RAP && (
          <MenuItem
            component={Link}
            onClick={handleClose}
            to={process.env.REACT_APP_ADMIN_PANEL_HOME_URL}
          >
            <Typography variant="body1">Admin Panel</Typography>
          </MenuItem>
        )}
        <MenuItem
          component={Link}
          onClick={handleClose}
          to={`/u/${identity.userId}/settings`}
        >
          <Typography variant="body1">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography variant="body1">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

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
        <Container disableGutters>
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
              <Divider flexItem orientation="vertical" />
              <Link to="/">
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="body1">Home</Typography>
                </Button>
              </Link>
              <Link to="/leaderboards">
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="body1">Leaderboards</Typography>
                </Button>
              </Link>
              <Link to="/about">
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="body1">About</Typography>
                </Button>
              </Link>
              <Link to={process.env.REACT_APP_DISCORD_INVITE_URL}>
                <Button sx={{ color: "white", textTransform: "none" }}>
                  <Typography variant="body1">Discord</Typography>
                </Button>
              </Link>

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
            </Stack>
            {/* Right Navbar */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {identity !== null ? (
                <ProfileSettingsMenu
                  identity={identity}
                  setIdentity={setIdentity}
                />
              ) : (
                <>
                  <Link to="/login">
                    <Button sx={{ color: "white", textTransform: "none" }}>
                      <Typography variant="body1">Login</Typography>
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button sx={{ color: "white", textTransform: "none" }}>
                      <Typography variant="body1">Register</Typography>
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
