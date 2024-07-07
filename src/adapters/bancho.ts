import axios from "axios"

const banchoApiInstance = axios.create({
  baseURL: process.env.REACT_APP_BANCHO_API_BASE_URL,
})

interface IsOnlineRequest {
  userId: number
}

export interface IsOnlineResponse {
  message: "ok"
  result: boolean
  status: number
}

export const userIsOnline = async (
  request: IsOnlineRequest
): Promise<IsOnlineResponse> => {
  try {
    const response = await banchoApiInstance.get("/v1/isOnline", {
      params: {
        id: request.userId,
      },
    })
    return {
      message: response.data.message,
      result: response.data.result,
      status: response.status,
    }
  } catch (e: any) {
    console.log(e)
    throw e
  }
}
