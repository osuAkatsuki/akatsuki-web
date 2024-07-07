import axios from "axios"

interface LeaderboardUser {
  id: number
  username: string
  username_aka: string
  registered_on: string
  privileges: number
  latest_activity: string
  country: string
  chosen_mode: {
    ranked_score: number
    total_score: number
    playcount: number
    playtime: number
    replays_watched: number
    total_hits: number
    level: number
    accuracy: number
    pp: number
    global_leaderboard_rank: number
    country_leaderboard_rank: number
    max_combo: number
  }
  play_style: number
  favourite_mode: number
}

interface LeaderboardResponse {
  code: number
  users: LeaderboardUser[]
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
    const response = await leaderboardApiInstance.post(
      // https://akatsuki.gg/api/v1/leaderboard?mode=0&rx=0&p=1&l=50&country=&sort=pp
      "/v1/leaderboard",
      {
        params: {
          mode: request.mode,
          rx: request.rx,
          p: request.p,
          l: request.l,
          country: request.country,
          sort: request.sort,
        },
      }
    )
    return {
      code: response.status,
      users: response.data.users.map((user: any) => ({
        id: user.id,
        username: user.username,
        username_aka: user.username_aka,
        registered_on: user.registered_on,
        privileges: user.privileges,
        latest_activity: user.latest_activity,
        country: user.country,
        chosen_mode: {
          ranked_score: user.chosen_mode.ranked_score,
          total_score: user.chosen_mode.total_score,
          playcount: user.chosen_mode.playcount,
          playtime: user.chosen_mode.playtime,
          replays_watched: user.chosen_mode.replays_watched,
          total_hits: user.chosen_mode.total_hits,
          level: user.chosen_mode.level,
          accuracy: user.chosen_mode.accuracy,
          pp: user.chosen_mode.pp,
          global_leaderboard_rank: user.chosen_mode.global_leaderboard_rank,
          country_leaderboard_rank: user.chosen_mode.country_leaderboard_rank,
          max_combo: user.chosen_mode.max_combo,
        },
        play_style: user.play_style,
        favourite_mode: user.favourite_mode,
      })),
    }
  } catch (e: any) {
    throw new Error(e.response.data.user_feedback)
  }
}
