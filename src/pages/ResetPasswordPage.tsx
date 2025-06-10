import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useSearchParams } from "react-router-dom"

import { verifyPasswordReset } from "../adapters/akatsuki-api/authentication"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { LoginDoorIcon } from "../components/images/icons/LoginDoorIcon"

export const ResetPasswordPage = () => {
  // TODO: captcha
  const [queryParams] = useSearchParams()
  const token = queryParams.get("token")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  if (!token) {
    return (
      <Alert severity="error">
        No password reset token provided. Please check the link you received.
      </Alert>
    )
  }

  const handleSubmit = async () => {
    const recaptchaToken = await recaptchaRef.current?.executeAsync()
    recaptchaRef.current?.reset()

    if (!recaptchaToken) {
      setError("Please complete the CAPTCHA.")
      return
    }

    try {
      setLoading(true)
      await verifyPasswordReset(token, password, recaptchaToken)
    } catch (e: any) {
      setLoading(false)
      setError(e.message)
      return
    }
    // TODO: auto-auth them or redirect them to the login page
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
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                size="invisible"
              />
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
                  loading
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
