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
import Container from "@mui/material/Container"
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
import useMediaQuery from "@mui/material/useMediaQuery"

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
    <Navbar />
    <Container>
      <Outlet />
    </Container>
  </>
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
      <Route path="/u/:userId" element={<ProfilePage />} />
      <Route path="/support" element={<SupportPage />} />
    </Route>
  )
)

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          ...(prefersDarkMode
            ? {
                // Use lighter variants
                primary: {
                  main: "#2c97fb",
                },
                secondary: {
                  main: "#ef43fe",
                },
              }
            : {
                // Use darker variants
                primary: {
                  main: "#1678c2",
                },
                secondary: {
                  main: "#e03997",
                },
              }),
          background: {
            default: "#110E1B",
          },
        },
        typography: {
          fontFamily: "Nunito",
        },
      }),
    [prefersDarkMode]
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
