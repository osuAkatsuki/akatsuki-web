import { Paper, Box, Typography } from "@mui/material";

export const RankingGraph = ({
  rankHistoryData,
}: {
  rankHistoryData: null; // TODO
}) => {
  return (
    <Paper elevation={3} sx={{ height: 1 / 1 }}>
      {/* Ranking Graph */}
      <Box sx={{ p: 2 }}>
        <Typography>TODO: Ranking graph here</Typography>
      </Box>
    </Paper>
  );
};
