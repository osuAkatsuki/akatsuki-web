import { type Score } from "../interfaces/scores";
import type { Success, Failure } from "../interfaces/api";

import queryString from "query-string";

// TODO: implement retry logic

const deserializeSuccessResponse = (responseData: any): Success<Score> => {
  return {
    status: "success",
    data: {
      scoreId: responseData.data.score_id,
      accountId: responseData.data.account_id,

      beatmapMd5: responseData.data.beatmap_md5,
      score: responseData.data.score,
      performancePoints: responseData.data.performance_points,
      accuracy: responseData.data.accuracy,
      highestCombo: responseData.data.highest_combo,
      fullCombo: responseData.data.full_combo,
      mods: responseData.data.mods,
      num300s: responseData.data.num_300s,
      num100s: responseData.data.num_100s,
      num50s: responseData.data.num_50s,
      numMisses: responseData.data.num_misses,
      numGekis: responseData.data.num_gekis,
      numKatus: responseData.data.num_katus,
      grade: responseData.data.grade,
      submissionStatus: responseData.data.submission_status,
      gameMode: responseData.data.game_mode,
      country: responseData.data.country,
      timeElapsed: responseData.data.time_elapsed,
      createdAt: new Date(responseData.data.created_at),
      updatedAt: new Date(responseData.data.updated_at),
      beatmapSetId: responseData.data.beatmap_set_id,
      beatmapRankedStatus: responseData.data.beatmap_ranked_status,
      beatmapArtist: responseData.data.beatmap_artist,
      beatmapTitle: responseData.data.beatmap_title,
      beatmapVersion: responseData.data.beatmap_version,
      beatmapCreator: responseData.data.beatmap_creator,
      beatmapMaxCombo: responseData.data.beatmap_max_combo,
      beatmapBpm: responseData.data.beatmap_bpm,
      beatmapCs: responseData.data.beatmap_cs,
      beatmapAr: responseData.data.beatmap_ar,
      beatmapOd: responseData.data.beatmap_od,
      beatmapHp: responseData.data.beatmap_hp,
      beatmapStarRating: responseData.data.beatmap_star_rating,
    },
    meta: {
      page: responseData.meta.page,
      pageSize: responseData.meta.page_size,
      total: responseData.meta.total,
    },
  };
};

const deserializeFailureResponse = (responseData: any): Failure => {
  return {
    status: "error",
    error: responseData.error,
    message: responseData.message,
  };
};

export const fetchOne = async (scoreId: number): Promise<Success<Score> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/scores/${scoreId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
    });
    const responseData = await response.json();
    if (!response.ok || responseData.status !== "success") {
      console.error(
        `Error fetching score ${scoreId}: ${responseData.error} - ${responseData.message}`
      );
      return deserializeFailureResponse(responseData);
    }
    return deserializeSuccessResponse(responseData);
  } catch (error) {
    console.error(`Error fetching score ${scoreId}: ${error}`);
    return {
      status: "error",
      error: "unknown",
      message: "Unknown error",
    };
  }
};

export const fetchManyScores = async ({
  beatmapMd5 = undefined,
  accountId = undefined,
  country = undefined,
  fullCombo = undefined,
  grade = undefined,
  gameMode = undefined,
  mods = undefined,
  submissionStatus = undefined,
  friends = undefined,
  beatmapRankedStatus = undefined,
  beatmapSetId = undefined,
  sortBy = "performance_points",
  page = 1,
  pageSize = 50,
}: {
  beatmapMd5?: string;
  accountId?: number;
  country?: string;
  fullCombo?: boolean;
  grade?: string;
  gameMode?: number;
  mods?: number;
  submissionStatus?: number;
  friends?: number[];
  beatmapRankedStatus?: number;
  beatmapSetId?: number;
  sortBy: "score" | "performance_points" | "accuracy" | "highest_combo" | "grade" | "created_at";
  page?: number;
  pageSize?: number;
}): Promise<Success<Score[]> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const query = queryString.stringify({
      beatmap_md5: beatmapMd5,
      account_id: accountId,
      country: country,
      full_combo: fullCombo,
      grade: grade,
      game_mode: gameMode,
      mods: mods,
      submission_status: submissionStatus,
      friends: friends,
      beatmap_ranked_status: beatmapRankedStatus,
      beatmap_set_id: beatmapSetId,
      sort_by: sortBy,
      page: page,
      page_size: pageSize,
    });
    const response = await fetch(`${baseUrl}/v1/scores?${query}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
    });
    const responseData = await response.json();
    if (!response.ok || responseData.status !== "success") {
      console.error(`Error fetching scores: ${responseData.error} - ${responseData.message}`);
      return deserializeFailureResponse(responseData);
    }
    return {
      status: "success",
      data: responseData.data.map(
        (score: any): Score => ({
          scoreId: score.score_id,
          accountId: score.account_id,
          beatmapMd5: score.beatmap_md5,
          score: score.score,
          performancePoints: score.performance_points,
          accuracy: score.accuracy,
          highestCombo: score.highest_combo,
          fullCombo: score.full_combo,
          mods: score.mods,
          num300s: score.num_300s,
          num100s: score.num_100s,
          num50s: score.num_50s,
          numMisses: score.num_misses,
          numGekis: score.num_gekis,
          numKatus: score.num_katus,
          grade: score.grade,
          submissionStatus: score.submission_status,
          gameMode: score.game_mode,
          country: score.country,
          timeElapsed: score.time_elapsed,
          createdAt: new Date(score.created_at),
          updatedAt: new Date(score.updated_at),
          // beatmap fields for convenience
          beatmapSetId: score.beatmap_set_id,
          beatmapRankedStatus: score.beatmap_ranked_status,
          beatmapArtist: score.beatmap_artist,
          beatmapTitle: score.beatmap_title,
          beatmapVersion: score.beatmap_version,
          beatmapCreator: score.beatmap_creator,
          beatmapMaxCombo: score.beatmap_max_combo,
          beatmapBpm: score.beatmap_bpm,
          beatmapCs: score.beatmap_cs,
          beatmapAr: score.beatmap_ar,
          beatmapOd: score.beatmap_od,
          beatmapHp: score.beatmap_hp,
          beatmapStarRating: score.beatmap_star_rating,
        })
      ),
      meta: {
        page: responseData.meta.page,
        pageSize: responseData.meta.page_size,
        total: responseData.meta.total,
      },
    };
  } catch (error) {
    console.error(`Error fetching scores: ${error}`);
    return {
      status: "error",
      error: "unknown",
      message: "Unknown error",
    };
  }
};
