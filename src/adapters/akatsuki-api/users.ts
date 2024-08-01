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

export interface UserGrades {
  XHCount: number
  XCount: number
  SHCount: number
  SCount: number
  ACount: number
  BCount: number
  CCount: number
  DCount: number
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
  globalLeaderboardRank: number | null
  countryLeaderboardRank: number | null
  maxCombo: number
  grades: UserGrades
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
  badges: UserBadge[] | null
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
  withCredentials: true,
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
          grades: {
            XHCount: stats.std.grades.xh_count,
            XCount: stats.std.grades.x_count,
            SHCount: stats.std.grades.sh_count,
            SCount: stats.std.grades.s_count,
            ACount: stats.std.grades.a_count,
            BCount: stats.std.grades.b_count,
            CCount: stats.std.grades.c_count,
            DCount: stats.std.grades.d_count,
          },
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
          grades: {
            XHCount: stats.taiko.grades.xh_count,
            XCount: stats.taiko.grades.x_count,
            SHCount: stats.taiko.grades.sh_count,
            SCount: stats.taiko.grades.s_count,
            ACount: stats.taiko.grades.a_count,
            BCount: stats.taiko.grades.b_count,
            CCount: stats.taiko.grades.c_count,
            DCount: stats.taiko.grades.d_count,
          },
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
          grades: {
            XHCount: stats.ctb.grades.xh_count,
            XCount: stats.ctb.grades.x_count,
            SHCount: stats.ctb.grades.sh_count,
            SCount: stats.ctb.grades.s_count,
            ACount: stats.ctb.grades.a_count,
            BCount: stats.ctb.grades.b_count,
            CCount: stats.ctb.grades.c_count,
            DCount: stats.ctb.grades.d_count,
          },
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
          grades: {
            XHCount: stats.mania.grades.xh_count,
            XCount: stats.mania.grades.x_count,
            SHCount: stats.mania.grades.sh_count,
            SCount: stats.mania.grades.s_count,
            ACount: stats.mania.grades.a_count,
            BCount: stats.mania.grades.b_count,
            CCount: stats.mania.grades.c_count,
            DCount: stats.mania.grades.d_count,
          },
        },
      })),
      playStyle: response.data.play_style,
      favouriteMode: response.data.favourite_mode,
      badges:
        response.data.badges?.map((badge: any) => ({
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          colour: badge.colour,
        })) ?? null,
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
