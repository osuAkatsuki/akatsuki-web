import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useSearchParams } from "react-router-dom"

import StaticPageBanner from "../components/images/banners/static_page_banner.svg"

export const ResetPasswordPage = () => {
  const [queryParams] = useSearchParams()
  const token = queryParams.get("token")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  if (!token) {
    return (
      <Alert severity="error">
        No password reset token provided. Please check the link you received.
      </Alert>
    )
  }

  return (
    <>
      <Box
        height={{ xs: 0, sm: 340 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${StaticPageBanner})`,
        }}
      />
      <Container maxWidth="xs" sx={{ mt: isMobile ? 0 : -20 }}>
        <Stack direction="column" borderRadius={4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundSize: "cover",
              backgroundImage: `url(${StaticPageBanner})`,
            }}
            py={5}
          >
            <Stack direction="column" alignItems="center">
              <SettingsIcon />
              <Typography variant="h5">User Settings</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Stack direction="column" spacing={2} p={2}>
              <Button></Button>
              <Divider />
              <Button></Button>
              <Divider />
              <Button></Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  )
}
