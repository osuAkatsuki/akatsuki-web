import { Button, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import {
  addRemoveFriend,
  RelationshipType,
} from "../../adapters/akatsuki-api/userRelationships"
import { type UserFullResponse } from "../../adapters/akatsuki-api/users"
import { useIdentityContext } from "../../context/identity"
import { AddUserIcon } from "../images/icons/AddUserIcon"

const getRelationshipColor = (relationship: RelationshipType) => {
  switch (relationship) {
    case RelationshipType.Friend:
      return "rgba(142, 249, 125, 1)"
    case RelationshipType.Mutual:
      return "rgba(231, 86, 255, 1)"
    case RelationshipType.NotFriend:
      return "rgba(18, 15, 29, 1)"
  }
}

export const ProfileRelationshipCard = ({
  profileUserId,
  relationship,
  setRelationship,
  userProfile,
  setUserProfile,
}: {
  profileUserId: number
  relationship: RelationshipType
  setRelationship: (relationship: RelationshipType) => void
  userProfile: UserFullResponse | null
  setUserProfile: (userProfile: UserFullResponse | null) => void
}) => {
  const { identity } = useIdentityContext()

  if (userProfile === null) {
    return null
  }

  const onClick = async () => {
    if (profileUserId === identity?.userId) {
      return
    }

    if (relationship === RelationshipType.NotFriend) {
      // Add them as a friend over the API
      // Conditionally set mutual vs. friend
      const response = await addRemoveFriend({
        user: profileUserId,
        add: true,
      })
      setUserProfile(
        userProfile && {
          ...userProfile,
          followers: userProfile.followers + 1,
        }
      )
      setRelationship(
        response.mutual ? RelationshipType.Mutual : RelationshipType.Friend
      )
    } else {
      addRemoveFriend({
        user: profileUserId,
        add: false,
      })
      setUserProfile(
        userProfile && {
          ...userProfile,
          followers: userProfile.followers - 1,
        }
      )
      // Remove them as a friend over the API
      setRelationship(RelationshipType.NotFriend)
    }
  }

  return (
    <Box borderRadius={11} overflow="hidden">
      <Button
        onClick={async () => await onClick()}
        sx={{ textDecoration: "none", color: "white", padding: 0 }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          bgcolor={getRelationshipColor(relationship)} //"rgba(18, 15, 29, 1)"
          py={0.5}
          px={1.5}
          alignItems="center"
        >
          {/* TODO: color icon based on relationship status */}
          {/* https://www.figma.com/design/moJEAJT6UYGnwQYIuKzanf?node-id=76-1050#878804687 */}

          <Box width={23} height={23}>
            <AddUserIcon />
          </Box>
          <Typography variant="h6">{userProfile.followers}</Typography>
        </Stack>
      </Button>
    </Box>
  )
}
