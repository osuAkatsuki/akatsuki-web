import { Avatar, Box, Container, Stack, Typography } from "@mui/material"
import { useParams } from "react-router-dom"

import { GradeXIcon } from "../components/images/grade-icons/GradeXIcon"
import { WatchReplayIcon } from "../components/images/icons/WatchReplayIcon"
import { getReplayBackground } from "../utils/scores"

export const ScorePage = () => {
  const queryParams = useParams()
  const scoreId = parseInt(queryParams["scoreId"] || "0")

  return (
    <Box>
      <Box
        pt={{ xs: 0, sm: 10 }}
        py={3}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${150054}/covers/cover.jpg)`,
          backgroundPosition: "center",
          boxShadow: "inset 0px 0px 0px 2000px rgba(21, 18, 34, 0.9)",
        }}
      >
        <Container>
          <Stack
            direction="column"
            justifyContent="space-between"
            borderRadius={4}
            overflow="hidden"
            sx={{
              backgroundSize: "cover",
              backgroundImage: `linear-gradient(90deg, rgba(15, 19, 38, 0.9) 0%, rgba(15, 19, 38, 0) 100%), url(https://assets.ppy.sh/beatmaps/150054/covers/cover.jpg)`,
              backgroundPosition: "center",
            }}
          >
            <Stack
              direction="column"
              p={3}
              sx={{
                backdropFilter: "blur(10px)",
                background:
                  "linear-gradient(270deg, rgba(21, 18, 34, 0.44375) 0%, rgba(17, 14, 27, 0.04) 36%, rgba(25, 20, 39, 0.8) 100%)",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5">
                  hapi - THE MEDLEY OF POKEMON RGBY+GSC -3PBs-
                </Typography>
                <Stack direction="row">
                  <Typography variant="h6">mapped by&nbsp;</Typography>
                  <Typography variant="h6" fontWeight={800}>
                    hapi
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row">
                {/* There is supposed to be a bubble here
                    that displays the star rating of the map
                    but it is not supported by our API yet */}
                <Typography variant="h6">Expert</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="column" justifyContent="space-around" px={3}>
                <Stack direction="column">
                  <Typography variant="h3" fontWeight="lighter">
                    221,312,384
                  </Typography>
                  <Stack direction="row">{/* Mods here */}</Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row">
                    <Typography variant="h4" fontWeight="medium">
                      {/* TODO: tooltip for exact pp amount */}
                      1112
                    </Typography>
                    <Typography variant="h4" fontWeight="lighter">
                      pp
                    </Typography>
                  </Stack>
                  <Box
                    width={6}
                    height={6}
                    borderRadius="50%"
                    bgcolor="white"
                  />
                  {/* Seperator here */}
                  <Typography variant="h4">#2</Typography>
                </Stack>
              </Stack>
              <Box width={284} height={205}>
                <GradeXIcon />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box bgcolor="#FFBD3B99" width="100%" height={2} />
      <Box
        width="100%"
        bgcolor="#211D35"
        color="#FFFFFF80"
        /* NOTE: increase zindex here to put the profile graph below this */
        position="relative"
        zIndex={2}
      >
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            p={1}
            color="white"
          >
            <Avatar
              alt="score-user-avatar"
              src={`https://a.akatsuki.gg/${1002}`}
              sx={{ width: 55, height: 55, borderRadius: 2 }}
            />
            <Stack direction="row" gap={1}>
              <Typography variant="h6">played by Mahmood</Typography>
              <Typography variant="h6" fontWeight="lighter">
                5 days ago
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Container>
        <Stack direction="row" justifyContent="space-between" p={3}>
          <Stack direction="row" gap={4}>
            <ScoreMetricDisplay metric="300" value={242} color="#41709C" />
            <ScoreMetricDisplay metric="100" value={82} color="#489C41" />
            <ScoreMetricDisplay metric="50" value={5} color="#9F652E" />
            <ScoreMetricDisplay metric="miss" value={0} color="#9C4141" />
          </Stack>
          <Stack direction="row" gap={4}>
            <ScoreMetricDisplay
              metric="accuracy"
              value="42.29%"
              color="#211D35"
            />
            <ScoreMetricDisplay metric="combo" value="4287x" color="#211D35" />
          </Stack>
        </Stack>

        <Stack
          height={475}
          borderRadius={2}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          gap={1}
          sx={{
            background: `url(${getReplayBackground(scoreId)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box height={98} width={98}>
            <WatchReplayIcon />
          </Box>
          <Typography variant="h5">Watch Replay</Typography>
        </Stack>
      </Container>
    </Box>
  )
}

const ScoreMetricDisplay = ({
  metric,
  value,
  color,
}: {
  metric: string
  value: number | string
  color: string
}) => {
  return (
    <Stack direction="row" gap={1}>
      <Typography
        variant="h6"
        fontWeight="lighter"
        px={2}
        borderRadius={1337}
        bgcolor={color}
      >
        {metric}
      </Typography>
      <Typography variant="h6" fontWeight={800}>
        {value}
      </Typography>
    </Stack>
  )
}
