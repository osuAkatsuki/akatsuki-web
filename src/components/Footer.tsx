import { Link } from "react-router-dom"
import { FooterLogo } from "./images/logos/FooterLogo"
import { Box, Stack, Typography } from "@mui/material"
import FooterBanner from "./images/banners/footer_banner.png"
import { Copyright, GitHub, Twitter } from "@mui/icons-material"
import { DiscordLogo } from "./images/logos/DiscordLogo"

export default function Footer() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "19vh",
        backgroundColor: "transparent",
        backgroundSize: "cover",
      }}
    >
      {/* Background banner */}
      <Box
        position="absolute"
        top={0}
        left={0}
        zIndex={0}
        display="block"
        width="100%"
        height="100%"
        sx={{ backgroundImage: `url(${FooterBanner})` }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        position="relative"
        zIndex={1}
        height="100%"
        width="100%"
        pt="1%"
        pb="1%"
        pl="15%"
        pr="15%"
        boxSizing="border-box"
      >
        {/* Left side footer */}
        <Stack direction="column" justifyContent="space-between" height="100%">
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
              <Typography fontWeight="lighter">Community Guidelines</Typography>
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
    </Box>
  )
}
