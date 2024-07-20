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
      <Box position="relative" height="19vh">
        {/* Background banner */}
        <Box
          position="absolute"
          top={0}
          left={0}
          zIndex={0}
          display="block"
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
            direction="row"
            position="relative"
            justifyContent="space-between"
            height="100%"
            py={3}
          >
            {/* Left side footer */}
            <Stack
              direction="column"
              justifyContent="space-between"
              height="100%"
            >
              <Box width={178} height={38}>
                <FooterLogo />
              </Box>

              <Stack direction="row" alignItems="center" gap={0.5}>
                <Copyright />
                <Typography variant="subtitle1" fontWeight="lighter">
                  Akatsuki 2024
                </Typography>
              </Stack>
            </Stack>

            {/* Right side footer */}
            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="flex-end"
              height="100%"
            >
              <Stack direction="row" spacing={5}>
                <Stack direction="column" spacing={1} textAlign="right">
                  {/* TODO: link these to pages */}
                  <Typography fontWeight="lighter">Akatsuki Team</Typography>
                  <Typography fontWeight="lighter">Contact Us</Typography>
                </Stack>

                <Stack direction="column" spacing={1} textAlign="right">
                  {/* TODO: link these to pages */}
                  <Typography fontWeight="lighter">
                    Community Guidelines
                  </Typography>
                  <Typography fontWeight="lighter">Terms of Service</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Link to={process.env.REACT_APP_PUBLIC_DISCORD_INVITE_URL!}>
                  <Box width={24} height={24}>
                    <DiscordLogo />
                  </Box>
                </Link>

                <Link
                  to={process.env.REACT_APP_PUBLIC_TWITTER_INVITE_URL!}
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  <Twitter />
                </Link>

                <Link
                  to={process.env.REACT_APP_PUBLIC_GITHUB_INVITE_URL!}
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  <GitHub />
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
