import { Box, Grid, Stack, Typography } from "@mui/material"
import { HomepageCarouselBackground } from "../images/HomepageCarouselBackground"

interface Score {
  username: string
  timeago: string
  pp: number
  mode: string
  song: string
  artist: string
  version: string
  mods: string
  grade: string
  accuracy: number
}

const FAKE_SCORE_DATA = [
  {
    username: "Stixe",
    timeago: "24 min",
    pp: 420,
    mode: "vanilla",
    song: "Hitorigoto",
    artist: "ClariS",
    version: "TV Size",
    mods: "HDHR",
    grade: "SS",
    accuracy: 100,
  },
]

const ScoresCarouselItem = ({ score }: { score: Score }) => {
  return (
    <Grid container>
      <Box
        width={528}
        height={274}
        // put this behind everything else
        position="relative"
        zIndex={-1}
      >
        <HomepageCarouselBackground />
        <Box
          position="absolute"
          left={0}
          top={0}
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <Stack direction="column" alignItems="center">
            PFP here
            <Typography variant="h5" color="white">
              {score.username}
            </Typography>
            <Typography variant="body1" color="white">
              {score.song}
            </Typography>
            <Typography variant="body2" color="white">
              by {score.artist}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Grid>
  )
}

export const ScoresCarousel = () => {
  return (
    <Stack direction="row" spacing={2}>
      {Array.from(FAKE_SCORE_DATA).map((score, _) => (
        <ScoresCarouselItem score={score} />
      ))}
    </Stack>
  )
}
