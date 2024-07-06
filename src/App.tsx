import React from "react";
import Navbar from "./components/Navbar";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LeaderboardsPage } from "./pages/LeaderboardsPage";
import { SupportPage } from "./pages/SupportPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DocumentationHomePage } from "./pages/DocumentationHomePage";
import Container from "@mui/material/Container";
import { UserContextProvider } from "./users";

const AppLayout = () => (
  <>
    <Navbar />
    <Container>
      <Outlet />
    </Container>
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
      <Route path="/profile/:accountId" element={<ProfilePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/documentation" element={<DocumentationHomePage />} />
    </Route>
  )
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#1678c2",
    },
    secondary: {
      main: "#e03997",
    },
  },
  typography: {
    fontFamily: "Rubik",
  },
});

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <UserContextProvider>
          <RouterProvider router={router} />
        </UserContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
