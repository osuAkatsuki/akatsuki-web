import { type OsuSession } from "../interfaces/osuSessions";
import type { Success, Failure } from "../interfaces/api";

const mapToSuccessModel = (responseData: any): Success<OsuSession> => {
  return {
    status: "success",
    data: {
      osuSessionId: responseData.data.osu_session_id,
      accountId: responseData.data.account_id,
      username: responseData.data.username,
      utcOffset: responseData.data.utcOffset,
      country: responseData.data.country,
      gameMode: responseData.data.game_mode,
      action: responseData.data.action,
      infoText: responseData.data.info_text,
      beatmapMd5: responseData.data.beatmap_md5,
      beatmapId: responseData.data.beatmap_id,
      mods: responseData.data.mods,
      spectatorHostOsuSessionId: responseData.data.spectator_host_osu_session_id,
      awayMessage: responseData.data.away_message,
      multiplayerMatchId: responseData.data.multiplayer_match_id,
      lastNpBeatmapId: responseData.data.last_np_beatmap_id,
      primary: responseData.data.primary,
      expiresAt: new Date(responseData.data.expires_at),
      createdAt: new Date(responseData.data.created_at),
      updatedAt: new Date(responseData.data.updated_at),
    },
    meta: {
      page: responseData.meta.page,
      pageSize: responseData.meta.page_size,
      total: responseData.meta.total,
    },
  };
};

const mapToFailureModel = (responseData: any): Failure => {
  return {
    status: "error",
    error: responseData.error,
    message: responseData.message,
  };
};

export const fetchOneOsuSession = async (
  osuSessionId: string
): Promise<Success<OsuSession> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/osu_sessions/${osuSessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error("An error occurred while processing the response.", responseData);
      return {
        status: "error",
        error: (responseData as Failure).error,
        message: (responseData as Failure).message,
      };
    }
    if (responseData.status === "success") {
      return mapToSuccessModel(responseData);
    } else {
      return mapToFailureModel(responseData);
    }
  } catch (error) {
    return {
      status: "error",
      error: "internal_server_error",
      message: "An unhandled error occurred while processing the response.",
    };
  }
};

export const fetchManyOsuSessions = async (page: number, pageSize: number) => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/sessions?page=${page}&page_size=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error("An error occurred while processing the response.", responseData);
      return {
        status: "error",
        error: (responseData as Failure).error,
        message: (responseData as Failure).message,
      };
    }
    if (responseData.status === "success") {
      return {
        status: "success",
        data: responseData.data.map((osuSession: any): OsuSession => {
          return {
            osuSessionId: osuSession.osu_session_id,
            accountId: osuSession.account_id,
            username: osuSession.username,
            utcOffset: osuSession.utcOffset,
            country: osuSession.country,
            gameMode: osuSession.game_mode,
            action: osuSession.action,
            infoText: osuSession.info_text,
            beatmapMd5: osuSession.beatmap_md5,
            beatmapId: osuSession.beatmap_id,
            mods: osuSession.mods,
            spectatorHostOsuSessionId: osuSession.spectator_host_osu_session_id,
            awayMessage: osuSession.away_message,
            multiplayerMatchId: osuSession.multiplayer_match_id,
            lastNpBeatmapId: osuSession.last_np_beatmap_id,
            primary: osuSession.primary,
            expiresAt: new Date(osuSession.expires_at),
            createdAt: new Date(osuSession.created_at),
            updatedAt: new Date(osuSession.updated_at),
          };
        }),
        meta: {
          page: responseData.meta.page,
          pageSize: responseData.meta.page_size,
          total: responseData.meta.total,
        },
      };
    }
    return {
      status: "error",
      error: responseData.error,
    };
  } catch (error) {
    return {
      status: "error",
      error: "internal_server_error",
      message: "An unhandled error occurred while processing the response.",
    };
  }
};
