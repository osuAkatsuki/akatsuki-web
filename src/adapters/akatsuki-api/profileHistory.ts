import axios from "axios"
import { GameMode } from "../../gameModes"

export enum ProfileHistoryType {
  GlobalRank = "global_rank",
  CountryRank = "country_rank",
  PP = "pp",
}

const getCaptureType = (historyType: ProfileHistoryType): string => {
  switch (historyType) {
    case ProfileHistoryType.GlobalRank:
      return "rank"
    case ProfileHistoryType.CountryRank:
      return "rank"
    case ProfileHistoryType.PP:
      return "pp"
    default:
      throw new Error("Invalid capture type")
  }
}

const getCaptureValue = (
  requestCapture: any,
  historyType: ProfileHistoryType
): number => {
  switch (historyType) {
    case ProfileHistoryType.GlobalRank:
      return requestCapture.overall
    case ProfileHistoryType.CountryRank:
      return requestCapture.country
    case ProfileHistoryType.PP:
      return requestCapture.pp
    default:
      throw new Error("Invalid capture type")
  }
}

interface ProfileHistoryRequest {
  // TODO: this abstraction does not match that of the
  // profile-history-service backend, but we do so to
  // increase functionality. We should migrate to new
  // APIs on the backend to allow this flexibility.
  // TODO: what about multiple params in one chart?
  type: ProfileHistoryType

  userId: number
  akatsukiMode: GameMode // NOTE: includes rx/ap
}

export interface ProfileHistoryCapture {
  value: number
  capturedAt: Date
}

export interface ProfileHistoryResponse {
  captures: ProfileHistoryCapture[]
  mode: number // NOTE: akatsuki mode
  userId: number
}

const profileHistoryApiInstance = axios.create({
  baseURL: process.env.REACT_APP_PROFILE_HISTORY_API_BASE_URL,
})

export const fetchUserProfileHistory = async (
  request: ProfileHistoryRequest
): Promise<ProfileHistoryResponse> => {
  try {
    const response = await profileHistoryApiInstance.get(
      `/v1/profile-history/${getCaptureType(request.type)}`,
      {
        params: {
          user_id: request.userId,
          mode: request.akatsukiMode,
        },
      }
    )

    return {
      captures: response.data.data.captures.map((capture: any) => ({
        value: getCaptureValue(capture, request.type),
        capturedAt: new Date(capture.captured_at),
      })),
      mode: response.data.data.mode,
      userId: response.data.data.userId,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
