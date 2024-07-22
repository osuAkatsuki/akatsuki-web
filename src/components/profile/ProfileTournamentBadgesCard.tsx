import { Tooltip, Avatar } from "@mui/material"
import Stack from "@mui/material/Stack"
import { UserTournamentBadge } from "../../adapters/akatsuki-api/users"

const ProfileTournamentBadgeCard = ({
  badge,
}: {
  badge: UserTournamentBadge
}) => {
  return (
    <Tooltip title={badge.name}>
      <Avatar
        key={badge.id}
        alt={badge.name}
        src={badge.icon}
        variant="rounded"
        sx={{ width: 104, height: 50 }}
      />
    </Tooltip>
  )
}

export const ProfileTournamentBadgesCard = ({
  badges,
}: {
  badges: UserTournamentBadge[]
}) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={1} useFlexGap>
      {badges.map((tournamentBadge) => (
        <ProfileTournamentBadgeCard
          key={tournamentBadge.id}
          badge={tournamentBadge}
        />
      ))}
    </Stack>
  )
}
