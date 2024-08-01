import {
  Box,
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import Divider from "@mui/material/Divider"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import { GlobalIcon } from "../components/DestinationIcons"
import { GamemodeSelectionBar } from "../components/GamemodeSelectionBar"
import {
  CountrySelection,
  GlobalUserLeaderboard,
  SortParam,
} from "../components/GlobalUserLeaderboard"
import LeaderboardBanner from "../components/images/banners/leaderboard_banner.svg"
import { LeaderboardIcon } from "../components/images/icons/LeaderboardIcon"
import { GameMode, RelaxMode } from "../gameModes"
import { ALPHA2_COUNTRY_LIST, getFlagUrl } from "../utils/countries"

const CountryMenuItem = ({
  divider,
  countryCode,
  countryName,
  setCountry,
  handleClose,
}: {
  divider?: boolean
  countryCode: string
  countryName: string
  setCountry: (country: CountrySelection) => void
  handleClose: () => void
}) => {
  return (
    <MenuItem
      key={countryCode}
      onClick={() => {
        setCountry({ countryCode, countryName })
        handleClose()
      }}
      divider={divider}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        {countryCode !== "all" ? (
          <Box
            component="img"
            src={getFlagUrl(countryCode)}
            alt={countryCode}
            height={20}
            width={20}
          />
        ) : (
          <GlobalIcon width={20} height={20} />
        )}
        <Typography variant="body1">{countryName}</Typography>
      </Stack>
    </MenuItem>
  )
}
const CountrySelectorMenu = ({
  country,
  setCountry,
}: {
  country: CountrySelection | null
  setCountry: (country: CountrySelection | null) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Grid container>
      <Stack direction="column" py={2}>
        <Typography variant="body1">Country</Typography>
        <Button
          id="country-selection-button"
          sx={{
            color: "white",
            textTransform: "none",
            bgcolor: "#110E1B",
            // TODO: make this grid-based/responsive
            minWidth: 300,
            justifyContent: "flex-start",
            borderRadius: 3,
          }}
          onClick={handleClick}
        >
          {country?.countryName ?? "All"}
        </Button>
        <Menu
          id="country-selection-menu"
          MenuListProps={{
            "aria-labelledby": "country-selection-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <CountryMenuItem
            key="all"
            divider
            countryCode="all"
            countryName="All"
            setCountry={setCountry}
            handleClose={handleClose}
          />
          {Object.entries(ALPHA2_COUNTRY_LIST).map(
            ([countryCode, countryName]) => (
              <CountryMenuItem
                key={countryCode}
                countryCode={countryCode}
                countryName={countryName}
                setCountry={setCountry}
                handleClose={handleClose}
              />
            )
          )}
        </Menu>
      </Stack>
    </Grid>
  )
}

interface LeaderboardQueryParams {
  mode: GameMode
  relax: RelaxMode
  sort: SortParam
  country: CountrySelection | null
}

const parseLeaderboardQueryParams = (
  queryParams: URLSearchParams
): LeaderboardQueryParams => {
  const requestedGameMode = queryParams.get("mode")
  let defaultGameMode = GameMode.Standard
  if (requestedGameMode !== null) {
    const mode = parseInt(requestedGameMode)
    if (!isNaN(mode) && mode >= 0 && mode <= 3) {
      defaultGameMode = mode
    }
  }

  const requestedRelaxMode = queryParams.get("relax")
  let defaultRelaxMode = RelaxMode.Vanilla
  if (requestedRelaxMode !== null) {
    const mode = parseInt(requestedRelaxMode)
    if (!isNaN(mode) && mode >= 0 && mode <= 2) {
      defaultRelaxMode = mode
    }
  }

  const requestedSortParam = queryParams.get("sort")
  let defaultSortParam = SortParam.Performance
  if (requestedSortParam !== null) {
    const sortParam = requestedSortParam as SortParam
    if (Object.values(SortParam).includes(sortParam)) {
      defaultSortParam = sortParam
    }
  }

  const requestedCountryCode = queryParams.get("country")?.toUpperCase() ?? null
  let defaultCountry = null
  if (requestedCountryCode !== null) {
    const countryName = ALPHA2_COUNTRY_LIST[requestedCountryCode]
    if (countryName) {
      defaultCountry = {
        countryCode: requestedCountryCode,
        countryName,
      }
    }
  }

  return {
    mode: defaultGameMode,
    relax: defaultRelaxMode,
    sort: defaultSortParam,
    country: defaultCountry,
  }
}

export const LeaderboardsPage = () => {
  const [queryParams, setQueryParams] = useSearchParams()
  const parsedQueryParams = parseLeaderboardQueryParams(queryParams)

  const [gameMode, _setGameMode] = useState(parsedQueryParams.mode)
  const [relaxMode, _setRelaxMode] = useState(parsedQueryParams.relax)
  const [sortParam, _setSortParam] = useState(parsedQueryParams.sort)
  const [country, _setCountry] = useState<CountrySelection | null>(
    parsedQueryParams.country
  )

  const setGameMode = (newGameMode: GameMode) => {
    _setGameMode(newGameMode)
    setQueryParams((searchParams) => {
      searchParams.set("mode", newGameMode.toString())
      return searchParams
    })
  }

  const setRelaxMode = (newRelaxMode: RelaxMode) => {
    _setRelaxMode(newRelaxMode)
    setQueryParams((searchParams) => {
      searchParams.set("relax", newRelaxMode.toString())
      return searchParams
    })
  }

  const setSortParam = (newSortParam: SortParam) => {
    _setSortParam(newSortParam)
    setQueryParams((searchParams) => {
      searchParams.set("sort", newSortParam)
      return searchParams
    })
  }

  const setCountry = (newCountry: CountrySelection | null) => {
    _setCountry(newCountry)
    setQueryParams((searchParams) => {
      searchParams.set("country", newCountry?.countryCode.toLowerCase() ?? "")
      return searchParams
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const SortParamSelector = ({ targetSort }: { targetSort: SortParam }) => {
    const isSelected = sortParam === targetSort
    return (
      <Box onClick={() => setSortParam(targetSort)}>
        <Typography
          fontSize={21}
          fontWeight={isSelected ? 700 : 200}
          sx={[
            {
              "&:hover": {
                cursor: "pointer",
                color: "hsl(0deg 0% 100% / 80%)",
              },
            },
          ]}
        >
          {targetSort}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box
        height={211}
        pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `
            linear-gradient(0deg, rgba(21, 18, 34, 0) 0%, rgba(21, 18, 34, 0.9) 100%),
            url(${LeaderboardBanner})
          `,
        }}
      >
        <Container sx={{ height: "100%" }}>
          <Stack
            px={3}
            height="100%"
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "space-around", sm: "space-between" }}
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={3}>
              <Box width={70} height={70}>
                <LeaderboardIcon />
              </Box>
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                sx={{ bgcolor: "#ffffff", opacity: "20%" }}
              />
              <Typography variant="body1" fontSize={25} fontWeight={300}>
                Leaderboards
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              gap={3}
              fontSize={21}
              fontWeight={200}
            >
              {/* <Typography fontSize={21} fontWeight={200}>clans</Typography> */}
              <SortParamSelector targetSort={SortParam.Score} />
              <SortParamSelector targetSort={SortParam.Performance} />
            </Stack>
          </Stack>
        </Container>
      </Box>
      {/* Mode Switches */}
      <Box width="100%" bgcolor="#211D35" color="#FFFFFF80">
        <Container>
          <GamemodeSelectionBar
            gameMode={gameMode}
            setGameMode={setGameMode}
            relaxMode={relaxMode}
            setRelaxMode={setRelaxMode}
          />
        </Container>
      </Box>
      <Container sx={{ backgroundColor: "#151223" }}>
        <CountrySelectorMenu country={country} setCountry={setCountry} />
      </Container>
      <Container sx={{ backgroundColor: "#191527" }}>
        <GlobalUserLeaderboard
          gameMode={gameMode}
          relaxMode={relaxMode}
          sortParam={sortParam}
          countryCode={country?.countryCode ?? null}
        />
      </Container>
    </>
  )
}
