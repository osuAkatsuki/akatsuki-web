import * as React from "react";
import { Typography, Button, Stack, Container } from "@mui/material";
import { useUserContext, removeUserFromLocalStorage } from "../users";
import { Link } from "react-router-dom";
import { logout } from "../adapters/webSessions";
import {
  Paper,
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { FavoriteOutlined, Logout, Settings } from "@mui/icons-material";

export default function Navbar() {
  const { user, setUser } = useUserContext();

  // Account settings menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const accountSettingsOpen = Boolean(anchorEl);
  const handleAccountSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    if (!user) {
      console.warn("User attempted a logout without being logged in");
      return;
    }
    await logout(user.session.webSessionId);
    removeUserFromLocalStorage();
    setUser(null);

    handleAccountSettingsClose();
  };

  return (
    <>
      <Paper elevation={1} square>
        <Container>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              p: 1.25,
            }}
          >
            {/* Left Navbar */}
            <Stack direction="row" spacing={1} sx={{ display: "flex" }}>
              <Link to="/">
                <Button>
                  <Typography variant="subtitle1">Akatsuki</Typography>
                </Button>
              </Link>
              <Divider orientation="vertical" flexItem />
              <Link to="/leaderboards">
                <Button>
                  <Typography variant="subtitle1">Leaderboards</Typography>
                </Button>
              </Link>
              <Link to="/documentation">
                <Button>
                  <Typography variant="subtitle1">Documentation</Typography>
                </Button>
              </Link>
            </Stack>
            {/* Right Navbar */}
            <Stack direction="row" spacing={1}>
              {/* TODO: add user search bar */}
              {user ? (
                <>
                  {/* TODO: player search bar with autocomplete functionality */}
                  {/* https://mui.com/material-ui/react-autocomplete/#search-as-you-type */}
                  {/* import { debounce } from '@mui/material/utils'; */}
                  <Link to="/support">
                    {/* TODO: heart emoji */}
                    <IconButton aria-label="support">
                      <FavoriteOutlined sx={{ color: "#db2828" }} />
                    </IconButton>
                  </Link>

                  <Tooltip title="Account settings">
                    <Button
                      onClick={handleAccountSettingsClick}
                      aria-controls={accountSettingsOpen ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={accountSettingsOpen ? "true" : undefined}
                    >
                      {/* TODO: is const 24x24 really a good idea? breakpoints? */}
                      {/* TODO: store avatarUrl on a per-user basis; ideally w/ breakpoints */}
                      <Avatar sx={{ width: 24, height: 24 }} src="https://a.akatsuki.gg/1001" />
                      <Typography sx={{ pl: 1 }} variant="subtitle1">
                        {user.account.username}
                      </Typography>
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button>
                      <Typography variant="subtitle1">Login</Typography>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button>
                      <Typography variant="subtitle1">Signup</Typography>
                    </Button>
                  </Link>
                </>
              )}
            </Stack>
          </Stack>
          {user && (
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={accountSettingsOpen}
              onClose={handleAccountSettingsClose}
            >
              <MenuItem onClick={handleAccountSettingsClose}>
                <Avatar src="https://a.akatsuki.gg/1001" />
                <Link to={`/profile/${user.account.accountId}`}>
                  <Typography sx={{ pl: 1 }}>Profile</Typography>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleAccountSettingsClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <Link to="/settings">
                  <Typography>Settings</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          )}
        </Container>
      </Paper>
    </>
  );
}
