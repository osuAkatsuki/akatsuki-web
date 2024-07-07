import axios from "axios"

export interface UserResponse {
  id: number
  username: string
  usernameAka: string
  registeredOn: Date
  privileges: number
  latestActivity: Date
  country: string
}

export interface UserStats {
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

export interface AllModeUserStats {
  std: UserStats
  taiko: UserStats
  ctb: UserStats
  mania: UserStats
}

export interface UserBadge {
  id: number
  name: string
  icon: string
  colour: string
}

export interface UserTournamentBadge {
  id: number
  name: string
  icon: string
}

export interface UserClan {
  id: number
  name: string
  tag: string
  description: string
  icon: string
  owner: number
  status: number // todo enum
}

export interface UserSilenceInfo {
  reason: string
  end: Date
}

export interface UserFullResponse extends UserResponse {
  stats: AllModeUserStats[]
  playStyle: number // todo enum
  favouriteMode: number // todo enum
  badges: UserBadge[]
  clan: UserClan
  followers: number
  tbadges?: UserTournamentBadge[]
  customBadge: UserBadge | null
  silenceInfo: UserSilenceInfo

  // only visible to admins
  cmNotes?: string[] // TODO
  banDate?: Date
  email?: string
}

const userApiInstance = axios.create({
  baseURL: process.env.REACT_APP_USER_API_BASE_URL,
})

export const fetchUser = async (userId: number): Promise<UserFullResponse> => {
  try {
    const response = await userApiInstance.get("/v1/users/full", {
      params: { id: userId },
    })
    return {
      id: response.data.id,
      username: response.data.username,
      usernameAka: response.data.username_aka,
      registeredOn: new Date(response.data.registered_on),
      privileges: response.data.privileges,
      latestActivity: new Date(response.data.latest_activity),
      country: response.data.country,
      stats: response.data.stats.map((stats: any) => ({
        std: {
          rankedScore: stats.std.ranked_score,
          totalScore: stats.std.total_score,
          playcount: stats.std.playcount,
          playtime: stats.std.playtime,
          replaysWatched: stats.std.replays_watched,
          totalHits: stats.std.total_hits,
          level: stats.std.level,
          accuracy: stats.std.accuracy,
          pp: stats.std.pp,
          globalLeaderboardRank: stats.std.global_leaderboard_rank,
          countryLeaderboardRank: stats.std.country_leaderboard_rank,
          maxCombo: stats.std.max_combo,
        },
        taiko: {
          rankedScore: stats.taiko.ranked_score,
          totalScore: stats.taiko.total_score,
          playcount: stats.taiko.playcount,
          playtime: stats.taiko.playtime,
          replaysWatched: stats.taiko.replays_watched,
          totalHits: stats.taiko.total_hits,
          level: stats.taiko.level,
          accuracy: stats.taiko.accuracy,
          pp: stats.taiko.pp,
          globalLeaderboardRank: stats.taiko.global_leaderboard_rank,
          countryLeaderboardRank: stats.taiko.country_leaderboard_rank,
          maxCombo: stats.taiko.max_combo,
        },
        ctb: {
          rankedScore: stats.ctb.ranked_score,
          totalScore: stats.ctb.total_score,
          playcount: stats.ctb.playcount,
          playtime: stats.ctb.playtime,
          replaysWatched: stats.ctb.replays_watched,
          totalHits: stats.ctb.total_hits,
          level: stats.ctb.level,
          accuracy: stats.ctb.accuracy,
          pp: stats.ctb.pp,
          globalLeaderboardRank: stats.ctb.global_leaderboard_rank,
          countryLeaderboardRank: stats.ctb.country_leaderboard_rank,
          maxCombo: stats.ctb.max_combo,
        },
        mania: {
          rankedScore: stats.mania.ranked_score,
          totalScore: stats.mania.total_score,
          playcount: stats.mania.playcount,
          playtime: stats.mania.playtime,
          replaysWatched: stats.mania.replays_watched,
          totalHits: stats.mania.total_hits,
          level: stats.mania.level,
          accuracy: stats.mania.accuracy,
          pp: stats.mania.pp,
          globalLeaderboardRank: stats.mania.global_leaderboard_rank,
          countryLeaderboardRank: stats.mania.country_leaderboard_rank,
          maxCombo: stats.mania.max_combo,
        },
      })),
      playStyle: response.data.play_style,
      favouriteMode: response.data.favourite_mode,
      badges: response.data.badges.map((badge: any) => ({
        id: badge.id,
        name: badge.name,
        icon: badge.icon,
        colour: badge.colour,
      })),
      clan: {
        id: response.data.clan.id,
        name: response.data.clan.name,
        tag: response.data.clan.tag,
        description: response.data.clan.description,
        icon: response.data.clan.icon,
        owner: response.data.clan.owner,
        status: response.data.clan.status,
      },
      followers: response.data.followers,
      tbadges: response.data.tbadges?.map((tbadge: any) => ({
        id: tbadge.id,
        name: tbadge.name,
        icon: tbadge.icon,
      })),
      customBadge: response.data.custom_badge
        ? {
            id: response.data.custom_badge.id,
            name: response.data.custom_badge.name,
            icon: response.data.custom_badge.icon,
            colour: response.data.custom_badge.colour,
          }
        : null,
      silenceInfo: {
        reason: response.data.silence_info.reason,
        end: new Date(response.data.silence_info.end),
      },
      // TODO?
      cmNotes: response.data.cm_notes,
      banDate: response.data.ban_date,
      email: response.data.email,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
