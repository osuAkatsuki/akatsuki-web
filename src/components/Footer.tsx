import { Link } from "react-router-dom";
import { FooterLogo } from "./images/logos/FooterLogo";
import { Box, Stack, Typography } from "@mui/material";
import { FooterBanner } from "./images/banners/FooterBanner";
import { Copyright, GitHub, Twitter } from "@mui/icons-material";
import { DiscordLogo } from "./images/logos/DiscordLogo";

export default function Footer() {
    return (
        <>
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
                <FooterBanner
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        zIndex: 0,
                        display: "block",
                        width: "100%",
                        height: "100%",
                    }}
                />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        height: '100%',
                        width: '100%',
                        pt: '1%',
                        pb: '1%',
                        pl: '15%',
                        pr: '15%',
                        boxSizing: "border-box"
                    }}
                >
                    {/* Left side footer */}
                    <Stack
                        direction="column"
                        justifyContent="space-between"
                        sx={{ height: "100%" }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <FooterLogo />
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <Stack alignItems="center" direction="row" gap={0.5} sx={{ verticalAlign: "middle" }}>
                                <Copyright />
                                <Typography variant="subtitle1" fontWeight="lighter">Akatsuki 2024</Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Right side footer */}
                    <Stack
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        sx={{ height: "100%" }}
                    >
                        <Stack direction="row" spacing={5}>
                            <Stack
                                direction="column"
                                spacing={1}
                                sx={{ display: "flex", alignItems: "right", textAlign: "right" }}
                            >
                                {/* TODO: link these to pages */}
                                <Typography fontWeight="lighter">Akatsuki Team</Typography>
                                <Typography fontWeight="lighter">Contact Us</Typography>
                            </Stack>

                            <Stack
                                direction="column"
                                spacing={1}
                                sx={{ display: "flex", alignItems: "right", textAlign: "right" }}
                            >
                                {/* TODO: link these to pages */}
                                <Typography fontWeight="lighter">Community Guidelines</Typography>
                                <Typography fontWeight="lighter">Terms of Service</Typography>
                            </Stack>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ display: "flex", alignItems: "right" }}
                        >
                            <Link to={process.env.REACT_APP_PUBLIC_DISCORD_INVITE_URL!}>
                                <DiscordLogo />
                            </Link>

                            <Twitter />
                            <GitHub />
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}
