import { Box, Stack, Typography } from "@mui/material"
import { formatNumber } from "../../utils/formatting"

export const HomepageStatDisplay = ({
  title,
  value,
  icon,
  lessRoundedCorner,
  shadowDirection,
}: {
  title: string
  value: number
  icon: JSX.Element
  lessRoundedCorner: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
  shadowDirection: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
}) => {
  const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
  const borderRadius = CORNERS.map(corner => corner === lessRoundedCorner ? "27px" : "50px").join(' ')

  const SHADOW_COLOR = "hsl(0deg 0% 0% / 0.2)"
  const shadowOffsetX = shadowDirection.endsWith("left") ? -20 : 20
  const shadowOffsetY = shadowDirection.startsWith("top") ? -20 : 20
  const boxShadow = `${SHADOW_COLOR} ${shadowOffsetX}px ${shadowOffsetY}px`
  return (
    <>
      <Box
        height={111}
        width={111}
        borderRadius={borderRadius}
        boxShadow={boxShadow}
      >
        {icon}
      </Box>
      <Stack direction="column" justifyContent="flex-end">
        <Typography variant="h4" fontWeight="lighter">
          {formatNumber(value)}
        </Typography>
        <Typography variant="h6" fontWeight="lighter">
          {title}
        </Typography>
      </Stack>
    </>
  )
}