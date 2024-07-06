import { useParams } from "react-router-dom";
import { Typography, Paper, Alert, Avatar } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { fetchManyScores } from "../adapters/scores";
import { Score } from "../interfaces/scores";
import { Stats } from "../interfaces/stats";
import { fetchStats } from "../adapters/stats";
import { GameplayStats } from "../components/GameplayStats";
import { Scores } from "../components/Scores";
import { RankingGraph } from "../components/RankingGraph";
import { fetchOneAccount } from "../adapters/accounts";
import { Account } from "../interfaces/accounts";
import PublicIcon from "@mui/icons-material/Public";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { ClientGameMode, RelaxMode, toServerModeFromClientAndRelaxModes } from "../gameModes";
import { SubmissionStatus } from "../scores";
import { getFlagUrl } from "../utils/countries";
import { GameModeSelectionBar } from "../components/GameModeSelectionBar";

export const ProfilePage = () => {
  const { accountId } = useParams();

  // TODO: better error handling; each component in the page
  // may be able to raise multiple errors; one global one won't cut it
  const [error, setError] = useState("");

  const [account, setAccount] = useState<Account | null>(null);
  const osuSession = null; // TODO

  const [statsData, fetchModeStats] = useState<Stats | null>(null);
  const rankHistoryData = null; // TODO

  const [gameMode, setGameMode] = useState(ClientGameMode.Standard);
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla);

  const [bestScores, setBestScores] = useState<Score[] | null>(null);
  const [recentScores, setRecentScores] = useState<Score[] | null>(null);

  useEffect(() => {
    const fetchProfileAccount = async () => {
      if (!accountId) return;

      const account = await fetchOneAccount(parseInt(accountId));
      if (account.status === "error") {
        setError("Failed to fetch data from server");
        return;
      }

      setAccount(account.data);
    };

    // run this asynchronously
    fetchProfileAccount().catch(console.error);
  }, [accountId]);

  useEffect(() => {
    const fetchProfileBestScores = async () => {
      if (!accountId) return;

      const serverGameMode = toServerModeFromClientAndRelaxModes(gameMode, relaxMode);

      const playerBestScores = await fetchManyScores({
        accountId: parseInt(accountId),
        gameMode: serverGameMode,
        submissionStatus: SubmissionStatus.Best,
        page: 1,
        pageSize: 50,
        sortBy: "performance_points",
      });
      if (playerBestScores.status === "error") {
        setError("Failed to fetch data from server");
        return;
      }

      setBestScores(playerBestScores.data);
    };

    // run this asynchronously
    fetchProfileBestScores().catch(console.error);
  }, [accountId, gameMode, relaxMode]);

  useEffect(() => {
    const fetchProfileRecentScores = async () => {
      if (!accountId) return;

      const serverGameMode = toServerModeFromClientAndRelaxModes(gameMode, relaxMode);

      const playerRecentScores = await fetchManyScores({
        accountId: parseInt(accountId),
        gameMode: serverGameMode,
        page: 1,
        pageSize: 50,
        sortBy: "created_at",
      });
      if (playerRecentScores.status === "error") {
        setError("Failed to fetch data from server");
        return;
      }

      setRecentScores(playerRecentScores.data);
    };

    // run this asynchronously
    fetchProfileRecentScores().catch(console.error);
  }, [accountId, gameMode, relaxMode]);

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!accountId) return;

      const serverGameMode = toServerModeFromClientAndRelaxModes(gameMode, relaxMode);

      const playerStats = await fetchStats(parseInt(accountId), serverGameMode);
      if (playerStats.status === "error") {
        setError("Failed to fetch data from server");
        return;
      }

      fetchModeStats(playerStats.data);
    };

    // run this asynchronously
    fetchProfileStats().catch(console.error);
  }, [accountId, gameMode, relaxMode]);

  if (!accountId) {
    return (
      <>
        <Typography variant="h2">Must provide an account id in the path.</Typography>
      </>
    );
  }

  if (error) {
    return <Alert severity="error">Something went wrong while loading the page</Alert>;
  }
  if (!account || !statsData || !bestScores || !recentScores) {
    // loading state
    return <>loading data</>;
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Stack direction="column" spacing={2}>
          <Box>
            {/* Avatar / Name / Online Status */}
            <Paper elevation={3}>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                  <Avatar
                    alt="user-avatar"
                    src="https://a.akatsuki.gg/1001"
                    sx={{ width: 124, height: 124 }}
                  />
                  <Stack direction="column">
                    <Typography variant="h5">{account.username}</Typography>
                    {osuSession ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WifiIcon sx={{ width: 20, height: 20 }} />
                        <Typography variant="subtitle1">Online</Typography>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WifiOffIcon sx={{ width: 20, height: 20 }} />
                        <Typography variant="subtitle1">Offline</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
                <Stack direction="column" justifyContent="flex-end" spacing={2} sx={{ p: 2 }}>
                  {/* TODO: add a method for fetching global & country rank from the backend */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4">#1</Typography>
                    <PublicIcon sx={{ width: 36, height: 36 }} />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4">#1</Typography>
                    <Box
                      component="img"
                      width={36}
                      height={36}
                      alt="flag-image"
                      src={getFlagUrl(account.country)}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Box>
          <GameModeSelectionBar
            gameMode={gameMode}
            relaxMode={relaxMode}
            setGameMode={setGameMode}
            setRelaxMode={setRelaxMode}
          />
          <Stack direction="row" spacing={2} sx={{ justifyContent: "space-evenly" }}>
            <Box sx={{ width: 1 / 3 }}>
              <GameplayStats statsData={statsData} />
            </Box>
            <Box sx={{ width: 2 / 3 }}>
              <RankingGraph rankHistoryData={rankHistoryData} />
            </Box>
          </Stack>
          <Box>
            <Scores scoresData={bestScores} title="Best Scores" />
          </Box>
          <Box>
            <Scores scoresData={recentScores} title="Recent Scores" />
          </Box>
        </Stack>
      </Paper>
    </>
  );
};
