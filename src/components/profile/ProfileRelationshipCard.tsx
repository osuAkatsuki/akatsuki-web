import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { AddUserIcon } from "../images/icons/AddUserIcon"

export const ProfileRelationshipCard = ({
  followers,
}: {
  followers: number
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      bgcolor="rgba(18, 15, 29, 1)"
      borderRadius={11}
      py={0.5}
      px={1.5}
      alignItems="center"
    >
      {/* TODO: color icon based on relationship status */}
      {/* https://www.figma.com/design/moJEAJT6UYGnwQYIuKzanf?node-id=76-1050#878804687 */}

      <Box width={23} height={23}>
        <AddUserIcon />
      </Box>
      <Typography variant="h6">{followers}</Typography>
    </Stack>
  )
}
