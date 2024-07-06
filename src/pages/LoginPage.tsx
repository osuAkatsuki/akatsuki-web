import { useRef, useState } from "react"
import { authenticate } from "../adapters/akatsuki-api/authentication"
import { useIdentityContext } from "../context"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import Stack from "@mui/material/Stack"
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

export const LoginPage = () => {
  const navigate = useNavigate()

  const { setIdentity } = useIdentityContext()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loginError, setLoginError] = useState("")

  const captchaRef = useRef<ReCAPTCHA>(null)

  const handleLogin = async () => {
    const captchaToken = await captchaRef.current?.executeAsync()
    captchaRef.current?.reset()

    if (!captchaToken) {
      console.error("No recaptcha token received")
      return
    }

    let identity
    try {
      identity = await authenticate({ username, password })
      if (identity === null) {
        setLoginError("Invalid username or password")
        return
      }
    } catch (e) {
      setLoginError("An error occurred while logging in")
      return
    }

    setLoginError("")
    setIdentity(identity)
    navigate("/", { replace: true })
  }

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
      spacing={2}
    >
      <Typography>Sign in to an existing account</Typography>
      {loginError && <Alert severity="error">{loginError}</Alert>}
      <TextField
        label="Username"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
      ></TextField>
      <TextField
        label="Password"
        type="password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      ></TextField>
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!}
        size="invisible"
        ref={captchaRef}
      />
      <Button type="submit" variant="outlined" onClick={handleLogin}>
        <Typography>Submit login</Typography>
      </Button>
    </Stack>
  )
}
