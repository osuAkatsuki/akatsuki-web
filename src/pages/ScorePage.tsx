import { Box, Container, Stack, Typography } from "@mui/material"

import { GradeXIcon } from "../components/images/grade-icons/GradeXIcon"

export const ScorePage = () => {
  return (
    <Box>
      <Box
        pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${150054}/covers/cover.jpg)`,
          backgroundPosition: "center",
          // TODO: figure out how to disable this shadow effect within UserIdentityCard
          boxShadow: "inset 0px 0px 0px 2000px rgba(21, 18, 34, 0.9)",
        }}
      >
        <Container>
          <Stack direction="column" justifyContent="space-between">
            <Stack direction="column">
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5">
                  hapi - THE MEDLEY OF POKEMON RGBY+GSC -3PBs-
                </Typography>
                <Stack direction="row">
                  <Typography variant="h6">mapped by&nbsp;</Typography>
                  <Typography variant="h6">hapi</Typography>
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
              <Stack direction="column" justifyContent="flex-end">
                <Typography variant="h3">221,312,384</Typography>
                <Stack direction="row">{/* Mods here */}</Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row">
                    <Typography variant="h4" fontWeight="medium">
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

      <Box
        width="100%"
        bgcolor="#211D35"
        color="#FFFFFF80"
        /* NOTE: increase zindex here to put the profile graph below this */
        position="relative"
        zIndex={2}
      >
        <Container>
          <Typography variant="h6">Score Graph</Typography>
        </Container>
      </Box>
    </Box>
  )
}
