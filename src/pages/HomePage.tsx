import { HomepageTextOutline } from "../components/images/logos/HomepageTextOutline"
import HomepageBanner from "../components/images/banners/homepage_banner.svg"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { Button, Container, Grid } from "@mui/material"
import { HomepagePPIcon } from "../components/images/icons/HomepagePPIcon"
import { HomepageUsersIcon } from "../components/images/icons/HomepageUsersIcon"
import { HomepageScoresIcon } from "../components/images/icons/HomepageScoresIcon"
import { WhiteoutAkatsukiLogo } from "../components/images/logos/WhiteoutAkatsukiLogo"
import { Link } from "react-router-dom"
export const HomePage = () => {
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
                <Stack direction="column" alignItems="center">
                  <Stack direction="row" width="100%" spacing={2}>
                    <Box
                      height={111}
                      width={111}
                      borderRadius="50px 50px 27px 50px"
                      boxShadow="hsl(0deg 0% 0% / 0.2) -20px 20px"
                    >
                      <HomepagePPIcon />
                    </Box>
                    <Stack direction="column" justifyContent="flex-end">
                      <Typography variant="h4" fontWeight="lighter">
                        1,483,238
                      </Typography>
                      <Typography variant="h6" fontWeight="lighter">
                        pp earned
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    width="100%"
                    mt={-1}
                    spacing={2}
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Stack direction="column">
                      <Typography variant="h4" fontWeight="lighter">
                        92,383,238
                      </Typography>
                      <Typography variant="h6" fontWeight="lighter">
                        scores set
                      </Typography>
                    </Stack>
                    <Box
                      height={111}
                      width={111}
                      borderRadius="50px 50px 50px 27px"
                      boxShadow="hsl(0deg 0% 0% / 0.2) 20px 20px"
                    >
                      <HomepageScoresIcon />
                    </Box>
                  </Stack>
                  <Stack direction="row" mt={5} spacing={2}>
                    <Box
                      height={111}
                      width={111}
                      borderRadius="50px 27px 50px 50px"
                      boxShadow="hsl(0deg 0% 0% / 0.2) -20px 20px"
                    >
                      <HomepageUsersIcon />
                    </Box>
                    <Stack direction="column">
                      <Typography variant="h4" fontWeight="lighter">
                        172,395
                      </Typography>
                      <Typography variant="h6" fontWeight="lighter">
                        registered users
                      </Typography>
                    </Stack>
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
