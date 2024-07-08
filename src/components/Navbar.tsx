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
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { FavoriteOutlined } from "@mui/icons-material"
import { removeIdentityFromLocalStorage, useIdentityContext } from "../context"
import { logout } from "../adapters/akatsuki-api/authentication"
import { useEffect, useMemo, useState } from "react"
import {
  searchUsers,
  SingleUserSearchResult,
} from "../adapters/akatsuki-api/search"

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
      <Paper elevation={1} square>
        <Container>
          <Stack direction="row" justifyContent="space-between" padding={1.25}>
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
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
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
