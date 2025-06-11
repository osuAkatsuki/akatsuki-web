import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { verifyPasswordReset } from "../adapters/akatsuki-api/authentication"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { LoginDoorIcon } from "../components/images/icons/LoginDoorIcon"
import { validatePasswordMeetsRequirements } from "../security"

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [queryParams] = useSearchParams()
  const token = queryParams.get("token")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!token) {
    return (
      <Alert severity="error">
        No password reset token provided. Please check the link you received.
      </Alert>
    )
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await verifyPasswordReset(token, password)
    } catch (e: any) {
      setLoading(false)
      setError(e.message)
      return
    }
    // TODO: perhaps attach some state to the website to send a message
    // to the user here that their password has been reset successfully
    navigate("/")
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
              <Typography variant="h5">Password Reset</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Stack direction="column" spacing={2} p={2}>
              <Alert severity="info">
                Your password must at least:
                <br />- Contain 8 characters
                <br />- Contain at least one digit
                <br />- Contain at least one uppercase letter
                <br />- Contain at least one lowercase letter
              </Alert>
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    bgcolor: "#110E1B",
                    borderColor: "red",
                    mt: 1,
                  },
                }}
                InputLabelProps={{ sx: { mt: 1 } }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && password && confirmPassword) {
                    await handleSubmit()
                  }
                  if (e.key === "Tab") {
                    e?.stopPropagation()
                  }
                }}
              />
              <TextField
                fullWidth
                id="confirm-password"
                label="Confirm Password"
                type="password"
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    bgcolor: "#110E1B",
                    borderColor: "red",
                    mt: 1,
                  },
                }}
                InputLabelProps={{ sx: { mt: 1 } }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && password && confirmPassword) {
                    await handleSubmit()
                  }
                  if (e.key === "Tab") {
                    e?.stopPropagation()
                  }
                }}
              />
              {error && (
                <Alert sx={{ mt: 1 }} severity="error">
                  {error}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundImage:
                    "linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)",
                  mt: 1.5,
                  borderRadius: 3,
                }}
                onKeyDown={(e: any) => {
                  if (e.key === "Tab") {
                    e?.stopPropagation()
                  }
                }}
                disabled={
                  password === "" ||
                  confirmPassword === "" ||
                  password !== confirmPassword ||
                  loading ||
                  !validatePasswordMeetsRequirements(password)
                }
              >
                <Stack direction="row" alignItems="center">
                  <Box width={24} height={24}>
                    <LoginDoorIcon />
                  </Box>
                  <Typography variant="body2">Reset Password</Typography>
                </Stack>
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  )
}
