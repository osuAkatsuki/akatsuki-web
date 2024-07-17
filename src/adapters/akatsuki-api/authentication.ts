import axios from "axios"
import type { Identity } from "../../context/identity"

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
  try {
    const response = await authApiInstance.post("/api/v1/authenticate", request)
    return {
      userId: response.data.user_id,
      username: response.data.username,
      privileges: response.data.privileges,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}

export const logout = async () => {
  try {
    await authApiInstance.post("/api/v1/logout")
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
