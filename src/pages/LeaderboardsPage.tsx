import { Box, Container, Stack, Typography } from "@mui/material"

import { GlobalUserLeaderboard } from "../components/GlobalUserLeaderboard"
import LeaderboardBanner from "../components/images/banners/leaderboard_banner.svg"
import { StandardGameModeIcon } from "../components/images/gamemode-icons/StandardGameModeIcon"
import { TaikoGameModeIcon } from "../components/images/gamemode-icons/TaikoGameModeIcon"
import { CatchGameModeIcon } from "../components/images/gamemode-icons/CatchGameModeIcon"
import { ManiaGameModeIcon } from "../components/images/gamemode-icons/ManiaGameModeIcon"
import { LeaderboardIcon } from "../components/images/icons/LeaderboardIcon"
import { GameMode, RelaxMode, isRealGameMode } from "../gameModes"
import { useState } from "react"

const BANNER_GRADIENT =
  `linear-gradient(0deg, rgba(21, 18, 34, 0) 0%, rgba(21, 18, 34, 0.9) 100%), url(${LeaderboardBanner})`;

const Seperator = () => {
  return (
    <svg width="2" height="45" viewBox="0 0 2 45" fill="none">
      <rect opacity="0.2" x="0.18042" y="0.471191" width="1.06506" height="43.6674" rx="0.532529" fill="white" />
    </svg>
  )
}

export const LeaderboardsPage = () => {
  const [gameMode, setGameMode] = useState(GameMode.Standard)
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla)
  const [sortParam, setSortParam] = useState("pp")
  const [country, setCountry] = useState<string | null>(null);

  const GameModeSelector = ({
    targetGameMode,
    icon,
  }: { targetGameMode: GameMode, icon: any }) => {
    const isSelected = gameMode === targetGameMode
    const isRealMode = isRealGameMode(targetGameMode, relaxMode)
    return (
      <Box
        height={25} width={25}
        onClick={() => { if (isRealMode) setGameMode(targetGameMode) }}
        sx={[
          {
            "&": {
              color: isSelected ? "white" : isRealMode ? null : "hsl(0deg 0% 100% / 20%)",
            }
          },
          {
            "&:hover": {
              cursor: isRealMode ? "pointer" : "not-allowed",
              color: isRealMode ? "hsl(0deg 0% 100% / 80%)" : null,
            }
          }
        ]}
      >
        {icon}
      </Box>
    )
  }

  const RelaxModeSelector = ({ targetRelaxMode }: { targetRelaxMode: RelaxMode }) => {
    const isSelected = relaxMode === targetRelaxMode
    const isRealMode = isRealGameMode(gameMode, targetRelaxMode)
    return (
      <Box
        onClick={() => { if (isRealMode) setRelaxMode(targetRelaxMode) }}
        sx={[
          {
            "&:hover": {
              cursor: isRealMode ? "pointer" : "not-allowed",
              color: isRealMode ? "hsl(0deg 0% 100% / 80%)" : null,
            }
          }
        ]}
      >
        <Typography
          fontSize={17}
          sx={{
            color: isSelected ? "white" : isRealMode ? null : "hsl(0deg 0% 100% / 20%)",
            fontWeight: isSelected ? 700 : 200,
          }}
        >
          {RelaxMode[targetRelaxMode].toLowerCase()}
        </Typography>
      </Box>
    )
  }

  const SortParamSelector = ({ targetSort }: { targetSort: string }) => {
    const isSelected = sortParam === targetSort
    return (
      <Box onClick={() => { setSortParam(targetSort) }}>
        <Typography
          fontSize={21}
          fontWeight={isSelected ? 700 : 200}
          sx={[
            {
              "&:hover": {
                cursor: "pointer",
                color: "hsl(0deg 0% 100% / 80%)",
              }
            }
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
        width="100%"
        position={{ sm: "absolute" }}
        px={0}
        top={0}
        left={0}
        zIndex={-1}
      >
        <Box height={211} pt={{ xs: 0, sm: 10 }} sx={{ background: BANNER_GRADIENT }}>
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
                <Seperator />
                <Typography variant="body1" fontSize={25} fontWeight={300}>Leaderboards</Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                gap={3}
                fontSize={21}
                fontWeight={200}
              >
                {/* <Typography fontSize={21} fontWeight={200}>clans</Typography> */}
                <SortParamSelector targetSort="score" />
                <SortParamSelector targetSort="pp" />
              </Stack>
            </Stack>
          </Container>
        </Box>
        {/* Mode Switches */}
        <Box width="100%" bgcolor="#211D35" color="#FFFFFF80">
          <Container>
            <Stack px={3} direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
              <Stack direction="row" py={2} gap={3}>
                <GameModeSelector targetGameMode={GameMode.Standard} icon={<StandardGameModeIcon />} />
                <GameModeSelector targetGameMode={GameMode.Taiko} icon={<TaikoGameModeIcon />} />
                <GameModeSelector targetGameMode={GameMode.Catch} icon={<CatchGameModeIcon />} />
                <GameModeSelector targetGameMode={GameMode.Mania} icon={<ManiaGameModeIcon />} />
              </Stack>

              <Stack direction="row" py={2} gap={3}>
                <RelaxModeSelector targetRelaxMode={RelaxMode.Vanilla} />
                <RelaxModeSelector targetRelaxMode={RelaxMode.Relax} />
                <RelaxModeSelector targetRelaxMode={RelaxMode.Autopilot} />
              </Stack>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ backgroundColor: "#191527" }}>
          <GlobalUserLeaderboard gameMode={gameMode} relaxMode={relaxMode} sortParam={sortParam} country={country} />
        </Container>
      </Box>
    </>
  )
}