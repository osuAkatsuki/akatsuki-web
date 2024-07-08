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
import { IdentityContextProvider } from "./context"
import { RegisterPage } from "./pages/RegisterPage"
import { LoginPage } from "./pages/LoginPage"
import { LeaderboardsPage } from "./pages/LeaderboardsPage"
import { ProfilePage } from "./pages/ProfilePage"
import { SupportPage } from "./pages/SupportPage"

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

// TODO: proper theme setup
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1678c2",
//     },
//     secondary: {
//       main: "#e03997",
//     },
//   },
//   typography: {
//     fontFamily: "Rubik",
//   },
// })

export default function App() {
  return (
    <React.StrictMode>
      {/* <ThemeProvider theme={theme}> */}
      <IdentityContextProvider>
        <RouterProvider router={router} />
      </IdentityContextProvider>
      {/* </ThemeProvider> */}
    </React.StrictMode>
  )
}
