import React from "react"
import Navbar from "./components/Navbar"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { IdentityContextProvider } from "./context/identity"
import { RegisterPage } from "./pages/RegisterPage"
import { LoginPage } from "./pages/LoginPage"
import { LeaderboardsPage } from "./pages/LeaderboardsPage"
import { ProfilePage } from "./pages/ProfilePage"
import { SupportPage } from "./pages/SupportPage"
import CssBaseline from "@mui/material/CssBaseline"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { AboutPage } from "./pages/AboutPage"
import Footer from "./components/Footer"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { TeamPage } from "./pages/TeamPage"
import { ContactPage } from "./pages/ContactPage"
import { TermsOfServicePage } from "./pages/TermsOfServicePage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"

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
      {/* TODO: support `/u/{username}` redirects */}
      <Route path="/u/:userId" element={<ProfilePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Route>
  )
)

export default function App() {
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
