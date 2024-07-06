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
import Container from "@mui/material/Container";
import { IdentityContextProvider } from "./context";

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
        <IdentityContextProvider>
          <RouterProvider router={router} />
        </IdentityContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
