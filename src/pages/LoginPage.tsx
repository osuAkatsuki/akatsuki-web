import React, { useRef } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useUserContext } from "../users";
import { login } from "../adapters/webSessions";
import { fetchOneAccount } from "../adapters/accounts";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { setUser } = useUserContext();

  const [loginError, setLoginError] = React.useState("");

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const reRef = useRef<ReCAPTCHA>(null);

  const handleLogin = async () => {
    const recaptchaToken = await reRef.current?.executeAsync();
    reRef.current?.reset();

    if (!recaptchaToken) {
      console.error("No recaptcha token received");
      return;
    }

    // login
    const sessionResponse = await login(username, password, recaptchaToken);
    if (sessionResponse.status === "error") {
      setLoginError(`${sessionResponse.message} (${sessionResponse.error})`);
      console.error("login failed", sessionResponse);
      return;
    }

    // fetch account data
    const accountResponse = await fetchOneAccount(sessionResponse.data.accountId);
    if (accountResponse.status === "error") {
      setLoginError(`${accountResponse.message} (${accountResponse.error})`);
      console.error("login failed", accountResponse);
      return;
    }

    // handle success
    setLoginError("");
    console.log("login success");
    setUser({
      session: sessionResponse.data,
      account: accountResponse.data,
    });
    // Redirect the user to "/" once they've logged in
    // TODO: can i display a success alert on the homepage?
    navigate("/", { replace: true });
  };

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
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
      ></TextField>
      <TextField
        label="Password"
        type="password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      ></TextField>
      <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!} size="invisible" ref={reRef} />
      <Button type="submit" variant="outlined" onClick={handleLogin}>
        <Typography>Submit login</Typography>
      </Button>
    </Stack>
  );
};
