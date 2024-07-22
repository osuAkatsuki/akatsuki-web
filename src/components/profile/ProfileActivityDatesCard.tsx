import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import { UserFullResponse } from "../../adapters/akatsuki-api/users"
import moment from "moment"

export const ProfileActivityDatesCard = ({
  userProfile,
}: {
  userProfile: UserFullResponse
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
      spacing={{ xs: 1, sm: 3 }}
    >
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          joined
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {moment(userProfile.registeredOn).fromNow()}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          last seen
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {moment(userProfile.latestActivity).fromNow()}
        </Typography>
      </Stack>
    </Stack>
  )
}
