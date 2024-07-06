import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { Link } from "react-router-dom";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

import { fetchManyStats } from "../adapters/stats";
import { useEffect, useState } from "react";
import { Stats } from "../interfaces/stats";
import { formatDecimal, formatNumber } from "../utils/formatting";

import { getFlagUrl } from "../utils/countries";
import { ClientGameMode, RelaxMode, toServerModeFromClientAndRelaxModes } from "../gameModes";
import { GameModeSelectionBar } from "../components/GameModeSelectionBar";

export const LeaderboardsPage = () => {
  const [error, setError] = useState("");

  const [gameMode, setGameMode] = useState(ClientGameMode.Standard);
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla);

  const [data, setData] = useState<Stats[] | null>(null);

  useEffect(() => {
    const serverGameMode = toServerModeFromClientAndRelaxModes(gameMode, relaxMode);
    const fetchData = async () => {
      const allStats = await fetchManyStats({
        gameMode: serverGameMode,
        page: 1,
        pageSize: 50,
      });
      if (allStats.status === "error") {
        setError("Failed to fetch data from server");
        return;
      }

      setData(allStats.data);
    };

    // run this asynchronously
    fetchData().catch(console.error);
  }, [gameMode, relaxMode]);

  if (!data) {
    // TODO: use https://mui.com/material-ui/react-skeleton/
    return <Typography>The page is currently loading</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
        <Typography variant="h4">Leaderboards</Typography>
        <GameModeSelectionBar
          gameMode={gameMode}
          relaxMode={relaxMode}
          setGameMode={setGameMode}
          setRelaxMode={setRelaxMode}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="leaderboard-table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Global Rank</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Country</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Username</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>Performance</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>Overall Accuracy</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>Ranked Score</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>Play Count</Typography>
                </TableCell>
                {/* <TableCell align="right">
                    <Typography>Level</Typography>
                  </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* TODO: username instead of account id */}
              {Object.entries(data).map(([index, row]: [string, Stats]) => (
                <TableRow
                  key={row.accountId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography>#{Number(index) + 1}</Typography>
                  </TableCell>
                  <TableCell>
                    {/* TODO: dynamic flags */}
                    <Box
                      component="img"
                      width={36}
                      height={36}
                      alt="flag-image"
                      src={getFlagUrl(row.country)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography>
                      <Link to={`/profile/${row.accountId}`}>{row.username}</Link>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{formatNumber(row.performancePoints)}pp</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{formatDecimal(row.accuracy)}%</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{formatNumber(row.rankedScore)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{formatNumber(row.playCount)}</Typography>
                  </TableCell>
                  {/* <TableCell align="right">Lv. {row.level}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
};
