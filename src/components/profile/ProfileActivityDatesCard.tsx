import { Tooltip, Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import moment from "moment"

import { UserFullResponse } from "../../adapters/akatsuki-api/users"

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
        <Tooltip title={moment(userProfile.registeredOn).format("LLLL")}>
          <Typography variant="body1" fontWeight="bold">
            {moment(userProfile.registeredOn).fromNow()}
          </Typography>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          last seen
        </Typography>
        <Tooltip title={moment(userProfile.latestActivity).format("LLLL")}>
          <Typography variant="body1" fontWeight="bold">
            {moment(userProfile.latestActivity).fromNow()}
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
