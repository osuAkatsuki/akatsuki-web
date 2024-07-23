import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material"
import { HomepageStatDisplay } from "../components/home/HomepageStatDisplay"
import HomepageBanner from "../components/images/banners/homepage_banner.svg"
import { HomepagePPIcon } from "../components/images/icons/HomepagePPIcon"
import { HomepageUsersIcon } from "../components/images/icons/HomepageUsersIcon"
import { HomepageScoresIcon } from "../components/images/icons/HomepageScoresIcon"
import { WhiteoutAkatsukiLogo } from "../components/images/logos/WhiteoutAkatsukiLogo"
import { Link } from "react-router-dom"


export const HomePage = () => {
  const totalPPEarned = 1_483_238;
  const totalScoresSet = 92_383_238;
  const totalUsersRegistered = 172_395;

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
                  <Button>
                    <Box width={315} height={68}>
                      <WhiteoutAkatsukiLogo />
                    </Box>
                  </Button>
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
                    <Link to="/login">
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
                        <Typography variant="body1">Sign In</Typography>
                      </Button>
                    </Link>
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
                      shadowDirection="bottom-left"
                    />
                  </Stack>
                  <Stack direction="row" mt={5} spacing={2}>
                    <HomepageStatDisplay
                      title="registered users"
                      value={totalUsersRegistered}
                      icon={<HomepageUsersIcon />}
                      lessRoundedCorner="top-right"
                      shadowDirection="bottom-left"
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
