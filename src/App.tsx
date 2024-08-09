import * as amplitude from "@amplitude/analytics-browser"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Stack from "@mui/material/Stack"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import React from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom"

import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { IdentityContextProvider } from "./context/identity"
import { AboutPage } from "./pages/AboutPage"
import { ContactPage } from "./pages/ContactPage"
import { HomePage } from "./pages/HomePage"
import { LeaderboardsPage } from "./pages/LeaderboardsPage"
import { LoginPage } from "./pages/LoginPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"
import { ProfilePage } from "./pages/ProfilePage"
import { RegisterPage } from "./pages/RegisterPage"
import { ScorePage } from "./pages/ScorePage"
import { SupportPage } from "./pages/SupportPage"
import { TeamPage } from "./pages/TeamPage"
import { TermsOfServicePage } from "./pages/TermsOfServicePage"
import { UserFriendsPage } from "./pages/UserFriendsPage"
import { UserSettingsPage } from "./pages/UserSettings"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const AppLayout = () => (
  <>
    <Stack direction="column" justifyContent="space-between" minHeight="100vh">
      <Navbar />
      <Box flexGrow={1}>
        <Outlet />
      </Box>
      <Footer />
    </Stack>
  </>
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
      <Route path="/u/:userId" element={<ProfilePage />} />
      <Route path="/u/:userId/settings" element={<UserSettingsPage />} />
      <Route path="/u/:userId/friends" element={<UserFriendsPage />} />
      <Route path="/score/:scoreId" element={<ScorePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Route>
  )
)

export default function App() {
  amplitude.init(process.env.REACT_APP_AMPLITUDE_API_KEY, {
    defaultTracking: true,
    minIdLength: 4,
  })

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#2c97fb",
          },
          secondary: {
            main: "#ef43fe",
          },
          background: {
            default: "#110E1B",
          },
        },
        typography: {
          fontFamily: "Nunito",
        },
      }),
    []
  )

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IdentityContextProvider>
          <RouterProvider router={router} />
        </IdentityContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
