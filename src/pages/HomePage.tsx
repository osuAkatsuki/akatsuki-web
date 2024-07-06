import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { useUserContext } from "../users";

export const HomePage = () => {
  const { user } = useUserContext();

  return (
    <Stack
      direction="column"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2">Welcome to Akatsuki</Typography>
      <Typography variant="h4">The largest competitive osu! private server</Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        {user ? (
          <Link to={`/profile/${user.account.accountId}`}>
            <Button variant="contained" color="primary">
              <Typography variant="h6">My Profile</Typography>
            </Button>
          </Link>
        ) : (
          <Link to="/signup">
            <Button variant="contained" color="primary">
              <Typography variant="h6">Sign Up</Typography>
            </Button>
          </Link>
        )}
        <Link to="/leaderboards">
          <Button variant="contained" color="secondary">
            <Typography variant="h6">Leaderboards</Typography>
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};
