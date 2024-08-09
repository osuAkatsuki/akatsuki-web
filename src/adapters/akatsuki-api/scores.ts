import axios from "axios"

interface GetScoreRequest {
  id: number
  rx: number
}

export interface ScoreDetails {
  id: number
  beatmapMd5: string
  score: number
  maxCombo: number
  fullCombo: boolean
  mods: number
  count300: number
  count100: number
  count50: number
  countGeki: number
  countKatu: number
  countMiss: number
  time: Date
  playMode: number
  accuracy: number
  pp: number
  rank: "XH" | "X" | "SH" | "S" | "A" | "B" | "C" | "D" | "F"
  completed: number
  pinned: boolean
  userId: number
  user: {
    id: number
    username: string
    usernameAka: string
    registeredOn: Date
    privileges: number
    latestActivity: Date
    country: string
  }
}

export interface BeatmapDetails {
  beatmapId: number
  beatmapsetId: number
  beatmapMd5: string
  songName: string
  ar: number
  od: number
  difficulty: number
  difficulty2: {
    std: number
    taiko: number
    ctb: number
    mania: number
  }
  maxCombo: number
  hitLength: number
  ranked: number
  rankedStatusFrozen: number
  latestUpdate: Date
}

export interface GetScoreResponse {
  code: number
  score: ScoreDetails
  beatmap: BeatmapDetails
}

const scoresApiInstance = axios.create({
  baseURL: process.env.REACT_APP_SCORES_API_BASE_URL,
  withCredentials: true,
})

export const getScore = async (
  request: GetScoreRequest
): Promise<GetScoreResponse> => {
  const response = await scoresApiInstance.get("/v1/score", {
    params: {
      id: request.id,
      rx: request.rx,
    },
  })
  return {
    code: response.data.code,
    score: {
      id: response.data.score.id,
      beatmapMd5: response.data.score.beatmap_md5,
      score: response.data.score.score,
      maxCombo: response.data.score.max_combo,
      fullCombo: response.data.score.full_combo,
      mods: response.data.score.mods,
      count300: response.data.score.count_300,
      count100: response.data.score.count_100,
      count50: response.data.score.count_50,
      countGeki: response.data.score.count_geki,
      countKatu: response.data.score.count_katu,
      countMiss: response.data.score.count_miss,
      time: new Date(response.data.score.time),
      playMode: response.data.score.play_mode,
      accuracy: response.data.score.accuracy,
      pp: response.data.score.pp,
      rank: response.data.score.rank,
      completed: response.data.score.completed,
      pinned: response.data.score.pinned,
      userId: response.data.score.user_id,
      user: {
        id: response.data.score.user.id,
        username: response.data.score.user.username,
        usernameAka: response.data.score.user.username_aka,
        registeredOn: new Date(response.data.score.user.registered_on),
        privileges: response.data.score.user.privileges,
        latestActivity: new Date(response.data.score.user.latest_activity),
        country: response.data.score.user.country,
      },
    },
    beatmap: {
      beatmapId: response.data.beatmap.beatmap_id,
      beatmapsetId: response.data.beatmap.beatmapset_id,
      beatmapMd5: response.data.beatmap.beatmap_md5,
      songName: response.data.beatmap.song_name,
      ar: response.data.beatmap.ar,
      od: response.data.beatmap.od,
      difficulty: response.data.beatmap.difficulty,
      difficulty2: {
        std: response.data.beatmap.difficulty2.std,
        taiko: response.data.beatmap.difficulty2.taiko,
        ctb: response.data.beatmap.difficulty2,
        mania: response.data.beatmap.difficulty2.mania,
      },
      maxCombo: response.data.beatmap.max_combo,
      hitLength: response.data.beatmap.hit_length,
      ranked: response.data.beatmap.ranked,
      rankedStatusFrozen: response.data.beatmap.ranked_status_frozen,
      latestUpdate: new Date(response.data.beatmap.latest_update),
    },
  }
}
