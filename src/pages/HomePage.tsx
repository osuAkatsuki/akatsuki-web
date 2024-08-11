import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { fetchTotalScoresSet } from "../adapters/akatsuki-api/aggregate-score-stats"
import {
  fetchTotalPPEarned,
  fetchTotalRegisteredUsers,
} from "../adapters/akatsuki-api/aggregate-user-stats"
import { HomepageStatDisplay } from "../components/home/HomepageStatDisplay"
import HomepageBanner from "../components/images/banners/homepage_banner.svg"
import { HomepagePPIcon } from "../components/images/icons/HomepagePPIcon"
import { HomepageScoresIcon } from "../components/images/icons/HomepageScoresIcon"
import { HomepageUsersIcon } from "../components/images/icons/HomepageUsersIcon"
import { WhiteoutAkatsukiLogo } from "../components/images/logos/WhiteoutAkatsukiLogo"

export const HomePage = () => {
  // TODO: fetch these from a backend API
  const [totalPPEarned, setTotalPPEarned] = useState(0)
  const [totalScoresSet, setTotalScoresSet] = useState(0)
  const [totalUsersRegistered, setTotalUsersRegistered] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const totalPPEarned = await fetchTotalPPEarned()
        setTotalPPEarned(totalPPEarned)
      } catch (error) {
        console.error("Failed to fetch total PP earned:", error)
        return
      }
    })()
  }, [totalPPEarned])

  useEffect(() => {
    ;(async () => {
      try {
        const totalScoresSet = await fetchTotalScoresSet()
        setTotalScoresSet(totalScoresSet)
      } catch (error) {
        console.error("Failed to fetch total scores set:", error)
        return
      }
    })()
  }, [totalScoresSet])

  useEffect(() => {
    ;(async () => {
      try {
        const totalUsersRegistered = await fetchTotalRegisteredUsers()
        setTotalUsersRegistered(totalUsersRegistered)
      } catch (error) {
        console.error("Failed to fetch total users registered:", error)
        return
      }
    })()
  }, [totalUsersRegistered])

  return (
    <Box>
      <Stack direction="column" justifyContent="space-between" spacing={2}>
        <Box
          py={{ xs: 4, sm: 16 }}
          sx={{
            backgroundImage: `url(${HomepageBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        >
          {/* TODO: figure out how to scale this */}
          {/* <Box
            position="absolute"
            zIndex={0}
            pt={{ sm: 10 }}
            top={{ sm: 0 }}
            left={0}
            width="100%"
            height="calc(600px - 10%)"
            sx={{
              opacity: { xs: 0.5, sm: 0.25 },
              pointerEvents: "none",
            }}
          >
            <HomepageTextOutline />
          </Box> */}
          <Container>
            <Grid
              container
              direction={{ xs: "column", sm: "row-reverse" }}
              spacing={{ xs: 2, sm: 16 }}
              justifyContent="center"
            >
              <Grid item xs={6}>
                <Stack
                  direction="column"
                  alignItems={{ xs: "center", sm: "flex-end" }}
                  spacing={3}
                >
                  <Box width={315} height={68}>
                    <WhiteoutAkatsukiLogo />
                  </Box>
                  <Typography textAlign={{ xs: "center", sm: "right" }}>
                    Welcome to Akatsuki! We are an osu! private server mainly
                    based around the relax mod - featuring score submission,
                    leaderboards & rankings, custom pp, and much more for relax,
                    autopilot and vanilla osu!
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Link to="/register">
                      <Button
                        variant="contained"
                        sx={{
                          color: "black",
                          bgcolor: "white",
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                        }}
                      >
                        <Typography variant="body1">Get Started!</Typography>
                      </Button>
                    </Link>
                    {/* TODO: hook this up to open the navbar auth menu */}
                    {/* <Link to="/register">
                      <Button
                        variant="contained"
                        sx={{
                          color: "white",
                          bgcolor: "rgba(21, 18, 34, 0.2)",
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                        }}
                      >
                        <Typography variant="body1">Sign up</Typography>
                      </Button>
                    </Link> */}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="column">
                  <Stack direction="row" width="100%" spacing={2}>
                    <HomepageStatDisplay
                      title="pp earned"
                      value={totalPPEarned}
                      icon={<HomepagePPIcon />}
                      lessRoundedCorner="bottom-right"
                      shadowDirection="bottom-left"
                      justifyText="bottom"
                      textAlign="left"
                    />
                  </Stack>
                  <Stack
                    direction="row-reverse"
                    width="100%"
                    mt={-1}
                    spacing={2}
                    justifyContent="flex-start"
                  >
                    <HomepageStatDisplay
                      title="scores set"
                      value={totalScoresSet}
                      icon={<HomepageScoresIcon />}
                      lessRoundedCorner="bottom-left"
                      shadowDirection="bottom-right"
                      justifyText="bottom"
                      textAlign="right"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    width="100%"
                    mt={5}
                    spacing={2}
                    justifyContent="center"
                  >
                    <HomepageStatDisplay
                      title="registered users"
                      value={totalUsersRegistered}
                      icon={<HomepageUsersIcon />}
                      lessRoundedCorner="top-right"
                      shadowDirection="bottom-left"
                      justifyText="top"
                      textAlign="left"
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Stack>
    </Box>
  )
}
