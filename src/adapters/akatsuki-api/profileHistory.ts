import axios from "axios"
import { GameMode } from "../../gameModes"
import { captureRejectionSymbol } from "events"
import { UNSAFE_useRouteId } from "react-router-dom"

interface ProfileHistoryRequest {
  type: "rank" | "pp"
  userId: number
  akatsukiMode: GameMode // NOTE: includes rx/ap
}
export interface ProfileHistoryCapture {
  overall: number
  country: number
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
      `/v1/profile-history/${request.type}`,
      {
        params: {
          user_id: request.userId,
          mode: request.akatsukiMode,
        },
      }
    )
    return {
      captures: response.data.data.captures.map((capture: any) => ({
        overall: capture.overall,
        country: capture.country,
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
