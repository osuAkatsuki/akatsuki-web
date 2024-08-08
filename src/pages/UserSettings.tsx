import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { FormEvent, useState } from "react"
import { useParams } from "react-router-dom"

import {
  updateEmailAddress,
  updatePassword,
  updateUsername,
} from "../adapters/akatsuki-api/users"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { useIdentityContext } from "../context/identity"

const ChangeFormButton = ({
  fieldName,
  displayName,
  inputType,
  autoComplete,
  onSubmit,
}: {
  fieldName: string
  displayName: string
  inputType: string
  autoComplete?: string
  onSubmit: (newValue: string) => void
}) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{ color: "white", textTransform: "none" }}
      >
        <Typography variant="body1">Change {displayName}</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const newValue = formJson[fieldName]
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            await onSubmit(newValue.toString())
            handleClose()
          },
        }}
      >
        <DialogTitle>Change {displayName}</DialogTitle>
        <DialogContent>
          <DialogContentText>Change your {displayName} here</DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete={autoComplete}
            margin="dense"
            id={fieldName}
            name={fieldName}
            label={`New ${displayName}`}
            type={inputType}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const getUserIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || "")
  if (isNaN(userId)) {
    // TODO: do API lookup
    userId = 0
  }
  return userId
}

export const UserSettingsPage = () => {
  const queryParams = useParams()
  const pageUserId = getUserIdFromQueryParams(queryParams["userId"])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { identity, setIdentity } = useIdentityContext()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Box
        height={{ xs: 0, sm: 340 }}
        // TODO: do we need anything like this?
        // pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${StaticPageBanner})`,
        }}
      />
      <Container maxWidth="xs" sx={{ mt: isMobile ? 0 : -20 }}>
        <Stack direction="column" borderRadius={4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundSize: "cover",
              backgroundImage: `url(${StaticPageBanner})`,
            }}
            py={5}
          >
            <Stack direction="column" alignItems="center">
              <SettingsIcon />
              <Typography variant="h5">User Settings</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Stack direction="column" spacing={2} p={2}>
              <ChangeFormButton
                fieldName="username"
                displayName="Username"
                inputType="text"
                autoComplete="username"
                onSubmit={async (newValue) => {
                  try {
                    await updateUsername(pageUserId, newValue)
                  } catch (e: any) {
                    setSnackbarOpen(true)
                    setSnackbarMessage(e.message)
                    return
                  }
                  if (identity !== null) {
                    setIdentity({ ...identity, username: newValue })
                  }
                }}
              />
              <Divider />
              <ChangeFormButton
                fieldName="password"
                displayName="Password"
                inputType="password"
                autoComplete="new-password"
                onSubmit={async (newValue) => {
                  try {
                    await updatePassword(pageUserId, newValue)
                  } catch (e: any) {
                    setSnackbarOpen(true)
                    setSnackbarMessage(e.message)
                    return
                  }
                }}
              />
              <Divider />
              <ChangeFormButton
                fieldName="email"
                displayName="Email Address"
                inputType="email"
                autoComplete="email"
                onSubmit={async (newValue) => {
                  try {
                    await updateEmailAddress(pageUserId, newValue)
                  } catch (e: any) {
                    setSnackbarOpen(true)
                    setSnackbarMessage(e.message)
                    return
                  }
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
