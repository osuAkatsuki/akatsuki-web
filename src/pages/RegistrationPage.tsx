import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useState } from "react"
import { useParams } from "react-router-dom"

import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { useIdentityContext } from "../context/identity"

const getUserIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || "")
  if (isNaN(userId)) {
    // TODO: do API lookup
    userId = 0
  }
  return userId
}

export const RegistrationPage = () => {
  const queryParams = useParams()
  const pageUserId = getUserIdFromQueryParams(queryParams["userId"])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { identity, setIdentity } = useIdentityContext()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Box
        height={{ xs: 0, sm: 340 }}
        // TODO: do we need anything like this?
        // pt={{ xs: 0, sm: 10 }}
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
              <Typography variant="h5">Account Registration</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <FormControl fullWidth>
              <Stack direction="column" spacing={2} p={2}>
                <FormLabel>Username</FormLabel>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  margin="dense"
                  id="username"
                  type="text"
                  autoComplete="username"
                  variant="standard"
                />
                <FormLabel>Email Address</FormLabel>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  margin="dense"
                  id="email"
                  type="email"
                  autoComplete="email"
                  variant="standard"
                />
                <FormLabel>Password</FormLabel>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  margin="dense"
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  variant="standard"
                />
                <Button
                  type="submit"
                  sx={{ color: "white", textDecoration: "none" }}
                >
                  Submit
                </Button>
              </Stack>
            </FormControl>
          </Box>
        </Stack>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
