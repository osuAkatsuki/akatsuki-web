import axios from "axios"

interface UserScoresRequest {
  type: "best" | "recent"
  mode: number
  p: number
  l: number
  rx: number
  id: number
}

export interface UserScoreBeatmap {
  beatmapId: number
  beatmapsetId: number
  beatmapMd5: string
  songName: string
  ar: number
  od: number
  difficulty: number
  difficulty2?: {
    std: number
    taiko: number
    ctb: number
    mania: number
  }
  maxCombo: number
  hitLength: number
  ranked: number
  rankedStatusFrozen: number
  latestUpdate: string
}

export interface UserScore {
  id: string
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
  time: string
  playMode: number
  accuracy: number
  pp: number
  rank: string
  completed: number
  pinned: boolean
  beatmap: UserScoreBeatmap
}

export interface UserScoresResponse {
  code: number
  scores: UserScore[]
}

const scoresApiInstance = axios.create({
  baseURL: process.env.REACT_APP_SCORES_API_BASE_URL,
})

export const fetchUserScores = async (
  request: UserScoresRequest
): Promise<UserScoresResponse> => {
  try {
    const response = await scoresApiInstance.get(
      `/v1/users/scores/${request.type}`,
      {
        params: {
          mode: request.mode,
          rx: request.rx,
          p: request.p,
          l: request.l,
          id: request.id,
        },
      }
    )
    return {
      code: response.status,
      scores: response.data.scores.map((score: any) => ({
        id: score.id,
        beatmapMd5: score.beatmap_md5,
        score: score.score,
        maxCombo: score.max_combo,
        fullCombo: score.full_combo,
        mods: score.mods,
        count300: score.count_300,
        count100: score.count_100,
        count50: score.count_50,
        countGeki: score.count_geki,
        countKatu: score.count_katu,
        countMiss: score.count_miss,
        time: score.time,
        playMode: score.play_mode,
        accuracy: score.accuracy,
        pp: score.pp,
        rank: score.rank,
        completed: score.completed,
        pinned: score.pinned,
        beatmap: {
          beatmapId: score.beatmap.beatmap_id,
          beatmapsetId: score.beatmap.beatmapset_id,
          beatmapMd5: score.beatmap.beatmap_md5,
          songName: score.beatmap.song_name,
          ar: score.beatmap.ar,
          od: score.beatmap.od,
          difficulty: score.beatmap.difficulty,
          difficulty2: score.beatmap.difficulty_2
            ? {
                std: score.beatmap.difficulty_2.std,
                taiko: score.beatmap.difficulty_2.taiko,
                ctb: score.beatmap.difficulty_2.ctb,
                mania: score.beatmap.difficulty_2.mania,
              }
            : null,
          maxCombo: score.beatmap.max_combo,
          hitLength: score.beatmap.hit_length,
          ranked: score.beatmap.ranked,
          rankedStatusFrozen: score.beatmap.ranked_status_frozen,
          latestUpdate: score.beatmap.latest_update,
        },
      })),
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
