import { useState } from "react"
import { authenticate } from "../adapters/akatsuki-api/authentication"
import { useIdentityContext } from "../context/identity"
import { useNavigate } from "react-router-dom"
import Stack from "@mui/material/Stack"
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useUiStateContext } from "../context/ui-state"

export const LoginPage = () => {
  const navigate = useNavigate()

  const { setIdentity } = useIdentityContext()
  const { setUiState } = useUiStateContext()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loginError, setLoginError] = useState("")

  const handleLogin = async () => {
    let identity
    try {
      identity = await authenticate({ username, password })
    } catch (e: any) {
      setLoginError(e.message)
      return
    }

    setLoginError("")
    setIdentity(identity)
    navigate("/", { replace: true })
  }

  setUiState({ navbarVariant: "light" })

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
        id="username"
        label="Username"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && username && password) {
            handleLogin()
          }
        }}
      ></TextField>
      <TextField
        id="password"
        label="Password"
        type="password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && username && password) {
            handleLogin()
          }
        }}
      ></TextField>
      <Button
        type="submit"
        variant="outlined"
        onClick={handleLogin}
        disabled={!(username && password)}
      >
        <Typography>Submit login</Typography>
      </Button>
    </Stack>
  )
}
