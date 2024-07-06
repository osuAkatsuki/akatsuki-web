import { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createAccount } from "../adapters/accounts";
import { login } from "../adapters/webSessions";
import { useUserContext } from "../users";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export const SignupPage = () => {
  const navigate = useNavigate();

  const { setUser } = useUserContext();

  const [signupError, setSignupError] = useState("");

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const reRef = useRef<ReCAPTCHA>(null);

  const submissionDisabled = () => {
    if (!username) return true;
    if (!emailAddress) return true;
    if (!password) return true;
    return false;
  };

  const handleSignup = async () => {
    const signupRecaptchaToken = await reRef.current?.executeAsync();
    reRef.current?.reset();

    if (!signupRecaptchaToken) {
      console.error("No recaptcha token received");
      return;
    }

    // sign up
    const country = "CA"; // TODO: dynamic
    const accountResponse = await createAccount(
      username,
      emailAddress,
      password,
      country,
      signupRecaptchaToken
    );
    if (accountResponse.status === "error") {
      setSignupError(`${accountResponse.message} (${accountResponse.error})`);
      console.error("signup failed", accountResponse);
      return;
    }

    const loginRecaptchaToken = await reRef.current?.executeAsync();
    reRef.current?.reset();

    if (!loginRecaptchaToken) {
      console.error("No recaptcha token received");
      return;
    }

    // upon signup, we automatically log the user in
    const account = accountResponse.data;
    const sessionResponse = await login(username, password, loginRecaptchaToken);
    if (sessionResponse.status === "error") {
      setSignupError(`${sessionResponse.message} (${sessionResponse.error})`);
      console.error("login failed", sessionResponse);
      return;
    }

    // handle success
    setSignupError("");
    console.log("login success");
    setUser({
      session: sessionResponse.data,
      account: account,
    });
    // Redirect the user to "/" once they've signed up
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
      <Typography>Sign up for a new account</Typography>
      {signupError && <Alert severity="error">{signupError}</Alert>}
      <TextField
        label="Username"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
      ></TextField>
      <TextField
        label="Password"
        type="password"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      ></TextField>
      <TextField
        label="Email Address"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setEmailAddress(e.target.value)}
      ></TextField>
      <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!} size="invisible" ref={reRef} />
      <Button
        type="submit"
        disabled={submissionDisabled()}
        variant="outlined"
        onClick={handleSignup}
      >
        <Typography>Submit signup</Typography>
      </Button>
    </Stack>
  );
};
