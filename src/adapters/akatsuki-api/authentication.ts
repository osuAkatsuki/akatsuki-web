import axios from "axios"
import type { Identity } from "../../context"

interface AuthenticateRequest {
  username: string
  password: string
}

const authApiInstance = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_BASE_URL,
})

export const authenticate = async (
  request: AuthenticateRequest
): Promise<Identity> => {
  const response = await authApiInstance.post("/api/v1/authenticate", request)
  if (response.status < 200 || response.status >= 300) {
    throw new Error(JSON.parse(response.data).user_feedback)
  }
  const responseData = JSON.parse(response.data)
  return {
    userId: responseData.user_id,
    username: responseData.username,
    privileges: responseData.privileges,
  }
}
