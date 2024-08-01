import axios from "axios"

export interface ChosenModeStats {
  rankedScore: number
  totalScore: number
  playcount: number
  playtime: number
  replaysWatched: number
  totalHits: number
  level: number
  accuracy: number
  pp: number
  globalLeaderboardRank: number
  countryLeaderboardRank: number
  maxCombo: number
}

export interface LeaderboardUser {
  id: number
  username: string
  usernameAka: string
  registeredOn: string
  privileges: number
  latestActivity: string
  country: string
  chosenMode: ChosenModeStats
  playStyle: number
  favouriteMode: number
}

export interface LeaderboardResponse {
  code: number
  users: LeaderboardUser[] | null
}

interface LeaderboardRequest {
  // TODO: enums
  mode: number
  rx: number
  p: number
  l: number
  country: string
  sort: string
}

const leaderboardApiInstance = axios.create({
  baseURL: process.env.REACT_APP_LEADERBOARD_API_BASE_URL,
})

export const fetchLeaderboard = async (
  request: LeaderboardRequest
): Promise<LeaderboardResponse> => {
  try {
    const response = await leaderboardApiInstance.get("/v1/leaderboard", {
      params: {
        mode: request.mode,
        rx: request.rx,
        p: request.p,
        l: request.l,
        country: request.country,
        sort: request.sort,
      },
    })
    return {
      code: response.status,
      users: response.data.users
        ? response.data.users.map((user: any) => ({
            id: user.id,
            username: user.username,
            usernameAka: user.username_aka,
            registeredOn: user.registered_on,
            privileges: user.privileges,
            latestActivity: user.latest_activity,
            country: user.country,
            chosenMode: {
              rankedScore: user.chosen_mode.ranked_score,
              totalScore: user.chosen_mode.total_score,
              playcount: user.chosen_mode.playcount,
              playtime: user.chosen_mode.playtime,
              replaysWatched: user.chosen_mode.replays_watched,
              totalHits: user.chosen_mode.total_hits,
              level: user.chosen_mode.level,
              accuracy: user.chosen_mode.accuracy,
              pp: user.chosen_mode.pp,
              globalLeaderboardRank: user.chosen_mode.global_leaderboard_rank,
              countryLeaderboardRank: user.chosen_mode.country_leaderboard_rank,
              maxCombo: user.chosen_mode.max_combo,
            },
            playStyle: user.play_style,
            favouriteMode: user.favourite_mode,
          }))
        : null,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
