import {
  Button,
  Grid,
  Typography,
  type ButtonPropsColorOverrides,
} from "@mui/material"
import { Link } from "react-router-dom"
import Stack from "@mui/material/Stack"
import { type OverridableStringUnion } from "@mui/types"
import { useIdentityContext } from "../context/identity"

const NavButton = ({
  to,
  color,
  label,
}: {
  to: string
  color: OverridableStringUnion<
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning",
    ButtonPropsColorOverrides
  >
  label: string
}) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Button variant="contained" color={color} fullWidth>
        <Typography variant="h6">{label}</Typography>
      </Button>
    </Link>
  )
}

const Header = () => (
  <>
    {" "}
    <Typography variant="h2" align="center">
      Welcome to Akatsuki
    </Typography>
    <Typography variant="h4" align="center">
      The largest competitive osu! private server
    </Typography>
  </>
)
export const HomePage = () => {
  const { identity } = useIdentityContext()

  return (
    <Stack
      direction="column"
      position="absolute"
      top={0}
      left={{ xs: "10%", sm: 0 }}
      paddingTop={{ xs: 20, sm: 10 }}
      height="100%"
      width={{ xs: "10%", sm: "100%" }}
      justifyContent="center"
    >
      <Header />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        {identity ? (
          <NavButton
            to={`/u/${identity.userId}`}
            color="primary"
            label="My Profile"
          />
        ) : (
          <NavButton to="/register" color="primary" label="Sign Up" />
        )}
        <NavButton
          to="/leaderboards"
          color="secondary"
          label="Leaderboards"
        />
      </Stack>
    </Stack>
  )
}
