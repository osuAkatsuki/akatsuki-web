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
  Tooltip,
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
import { type Identity, useIdentityContext } from "../context/identity"
import { UserPrivileges } from "../privileges"

const ChangeUsernameButton = ({
  userId,
  setSnackbarOpen,
  setSnackbarMessage,
  identity,
  setIdentity,
  isSupporter,
}: {
  userId: number
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
  identity: Identity | null
  setIdentity: (identity: Identity | null) => void
  isSupporter: boolean
}) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Tooltip title="(Supporter-only feature)">
        <Box display="flex" justifyContent="center">
          <Button
            disabled={!isSupporter}
            onClick={handleClickOpen}
            sx={{ color: "white", textTransform: "none" }}
          >
            <Typography variant="body1">Change Display Name</Typography>
          </Button>
        </Box>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const newUsername = formJson["new-username"].toString()
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updateUsername(userId, newUsername)
            } catch (e: any) {
              setSnackbarOpen(true)
              setSnackbarMessage(e.message)
              return
            }
            if (identity !== null) {
              setIdentity({ ...identity, username: newUsername })
            }

            handleClose()
          },
        }}
      >
        <DialogTitle>Change your Display Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supporters can use this feature to change their display names across
            the website and osu! server, fully self-serve as they desire.
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="username"
            margin="dense"
            id="new-username"
            name="new-username"
            label="New Display Name "
            type="text"
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

const ChangePasswordButton = ({
  userId,
  setSnackbarOpen,
  setSnackbarMessage,
}: {
  userId: number
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
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
        <Typography variant="body1">Change Password</Typography>
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
            const currentPassword = formJson["current-password"].toString()
            const newPassword = formJson["new-password"].toString()
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updatePassword(userId, currentPassword, newPassword)
            } catch (e: any) {
              setSnackbarOpen(true)
              setSnackbarMessage(e.message)
              return
            }
            handleClose()
          },
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>Change your password here</DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id="current-password"
            name="current-password"
            label="Current Password"
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="new-password"
            margin="dense"
            id="new-password"
            name="new-password"
            label="New Password"
            type="password"
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

const ChangeEmailAddressButton = ({
  userId,
  setSnackbarOpen,
  setSnackbarMessage,
}: {
  userId: number
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
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
        <Typography variant="body1">Change Email Address</Typography>
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
            const currentPassword = formJson["current-password"].toString()
            const newEmailAddress = formJson["new-email-address"].toString()
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updateEmailAddress(userId, currentPassword, newEmailAddress)
            } catch (e: any) {
              setSnackbarOpen(true)
              setSnackbarMessage(e.message)
              return
            }
            handleClose()
          },
        }}
      >
        <DialogTitle>Change Email Address</DialogTitle>
        <DialogContent>
          <DialogContentText>Change your email address here</DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id="current-password"
            name="current-password"
            label="Current Password"
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="email"
            margin="dense"
            id="new-email-address"
            name="new-email-address"
            label="New Email Address"
            type="email"
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
              <ChangePasswordButton
                userId={pageUserId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
              <Divider />
              <ChangeEmailAddressButton
                userId={pageUserId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
              <Divider />
              <ChangeUsernameButton
                userId={pageUserId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                identity={identity}
                setIdentity={setIdentity}
                isSupporter={
                  ((identity?.privileges ?? 0) & UserPrivileges.USER_DONOR) !==
                  0
                }
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
