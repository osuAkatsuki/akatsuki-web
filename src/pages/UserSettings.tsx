import SettingsIcon from "@mui/icons-material/Settings"
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { FormEvent, useState } from "react"

import StaticPageBanner from "../components/images/banners/static_page_banner.svg"

const ChangeFormButton = ({
  fieldName,
  displayName,
  inputType,
}: {
  fieldName: string
  displayName: string
  inputType: string
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
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const newValue = formJson[fieldName]
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            // TODO: submit the new value to the server
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

const ChangeUsernameFormButton = () => {
  return (
    <ChangeFormButton
      fieldName="username"
      displayName="Username"
      inputType="text"
    />
  )
}
const ChangePasswordFormButton = () => {
  return (
    <ChangeFormButton
      fieldName="password"
      displayName="Password"
      inputType="password"
    />
  )
}

const ChangeEmailFormButton = () => {
  return (
    <ChangeFormButton
      fieldName="email"
      displayName="Email Address"
      inputType="email"
    />
  )
}

export const UserSettingsPage = () => {
  return (
    <>
      <Box
        height={340}
        // TODO: do we need anything like this?
        // pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${StaticPageBanner})`,
        }}
      />
      <Container maxWidth="xs" sx={{ mt: -20 }}>
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
              <ChangeUsernameFormButton />
              <Divider />
              <ChangePasswordFormButton />
              <Divider />
              <ChangeEmailFormButton />
              {/* <Divider />
              <CustomizeProfileFormButton />
              <Divider />
              <GameplayPreferencesFormButton /> */}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  )
}

// <Button sx={{ color: "white", textTransform: "none" }}>
// <Typography variant="body1">Change Username</Typography>
// </Button>
// <Divider />
// <Button sx={{ color: "white", textTransform: "none" }}>
// <Typography variant="body1">Change Password</Typography>
// </Button>
// <Divider />
// <Button sx={{ color: "white", textTransform: "none" }}>
// <Typography variant="body1">Change Email</Typography>
// </Button>
// <Divider />
// <Button sx={{ color: "white", textTransform: "none" }}>
// <Typography variant="body1">Customize Profile</Typography>
// </Button>
// <Divider />
// <Button sx={{ color: "white", textTransform: "none" }}>
// <Typography variant="body1">Gameplay Preferences</Typography>
// </Button>
// </Stack>
