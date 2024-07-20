import { Link } from "react-router-dom"
import { FooterLogo } from "./images/logos/FooterLogo"
import { Box, Container, Divider, Stack, Typography } from "@mui/material"
import FooterBanner from "./images/banners/footer_banner.png"
import { Copyright, GitHub, Twitter } from "@mui/icons-material"
import { DiscordLogo } from "./images/logos/DiscordLogo"

export default function Footer() {
  return (
    <Box mt={4}>
      <Divider
        sx={{
          height: "4px",
          backgroundImage: `linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)`,
        }}
      />
      <Box position="relative" height="100%">
        {/* Background banner */}
        <Box
          position="absolute"
          top={0}
          left={0}
          zIndex={-1}
          width="100%"
          height="100%"
          sx={{
            backgroundImage: `url(${FooterBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Container sx={{ height: "100%" }}>
          <Stack
            direction="column"
            justifyContent="space-between"
            height="100%"
            spacing={{ xs: 2, sm: 4 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 0 }}
              justifyContent="space-between"
              alignItems="center"
              pt={4}
            >
              <Box width={178} height={38}>
                <FooterLogo />
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                textAlign={{ xs: "center", sm: "right" }}
              >
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6" fontWeight="lighter">
                    Akatsuki Team
                  </Typography>
                  <Typography variant="h6" fontWeight="lighter">
                    Contact Us
                  </Typography>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6" fontWeight="lighter">
                    Community Guidelines
                  </Typography>
                  <Typography variant="h6" fontWeight="lighter">
                    Terms of Service
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              pb={4}
              spacing={{ xs: 2, sm: 0 }}
            >
              <Stack direction="row">
                <Copyright />
                <Typography variant="h6" fontWeight="lighter">
                  Akatsuki 2024
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Link to={process.env.REACT_APP_DISCORD_INVITE_URL}>
                  <Box height={36} width={36}>
                    <DiscordLogo />
                  </Box>
                </Link>
                <Link
                  to={process.env.REACT_APP_GITHUB_ORG_URL}
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  <GitHub sx={{ width: 36, height: 36 }} />
                </Link>
                <Link
                  to="/twitter"
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  <Twitter sx={{ width: 36, height: 36 }} />
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
