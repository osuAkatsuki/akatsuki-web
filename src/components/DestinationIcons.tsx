import PublicIcon from "@mui/icons-material/Public"
import { Box, Tooltip } from "@mui/material"

import { getCountryName, getFlagUrl } from "../utils/countries"

export const GlobalIcon = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  return <PublicIcon sx={{ width, height }} />
}

export const FlagIcon = ({
  country,
  height,
  width,
}: {
  country: string
  height: number
  width: number
}) => {
  return (
    <Tooltip title={getCountryName(country)} placement="top">
      <Box
        component="img"
        height={height}
        width={width}
        alt="flag-image"
        src={getFlagUrl(country)}
      />
    </Tooltip>
  )
}
