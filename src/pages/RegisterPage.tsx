import * as amplitude from "@amplitude/analytics-browser"
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
import { useRef, useState } from "react"
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from "react-google-recaptcha"
import { useNavigate } from "react-router-dom"

import { createUser } from "../adapters/akatsuki-api/users"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { LoginDoorIcon } from "../components/images/icons/LoginDoorIcon"
import { useIdentityContext } from "../context/identity"
import { validatePasswordMeetsRequirements } from "../security"

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { identity, setIdentity } = useIdentityContext()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [username, setUsername] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  // TODO: redir if already auth'd

  const handleSubmit = async () => {
    const recaptchaToken = await recaptchaRef.current?.executeAsync()
    recaptchaRef.current?.reset()

    if (!recaptchaToken) {
      setError("Please complete the CAPTCHA.")
      return
    }

    let identity

    try {
      setLoading(true)
      identity = await createUser(
        username,
        emailAddress,
        password,
        recaptchaToken
      )
    } catch (e: any) {
      setLoading(false)
      setError(e.message)
      return
    }

    amplitude.setUserId(String(identity.userId))
    setLoading(false)
    setError("")
    setIdentity(identity)
    // TODO: send them to a verification page (telling them to login w/ osu to activate their account)
    navigate("/")
  }

  const isReadyForSubmission = (): boolean => {
    // TODO: some more validation on username / email
    return !(
      username === "" ||
      emailAddress === "" ||
      password === "" ||
      confirmPassword === "" ||
      password !== confirmPassword ||
      loading ||
      !validatePasswordMeetsRequirements(password)
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
              <Typography variant="h5">Create Account</Typography>
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
                id="username"
                label="Username"
                type="username"
                autoComplete="username"
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
                  setUsername(e.target.value)
                }
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && isReadyForSubmission()) {
                    await handleSubmit()
                  }
                  if (e.key === "Tab") {
                    e?.stopPropagation()
                  }
                }}
              />
              <TextField
                fullWidth
                id="email-address"
                label="Email Address"
                type="email"
                autoComplete="email"
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
                  setEmailAddress(e.target.value)
                }
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && isReadyForSubmission()) {
                    await handleSubmit()
                  }
                  if (e.key === "Tab") {
                    e?.stopPropagation()
                  }
                }}
              />
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
                  if (e.key === "Enter" && isReadyForSubmission()) {
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
                  if (e.key === "Enter" && isReadyForSubmission()) {
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
                disabled={!isReadyForSubmission()}
              >
                <Stack direction="row" alignItems="center">
                  <Box width={24} height={24}>
                    <LoginDoorIcon />
                  </Box>
                  <Typography variant="body2">Create Account</Typography>
                </Stack>
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  )
}
