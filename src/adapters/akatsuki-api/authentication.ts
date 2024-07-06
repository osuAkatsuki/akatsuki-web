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
): Promise<Identity | null> => {
  const response = await authApiInstance.post("/api/v1/authenticate", request)
  if (response.status >= 400) {
    throw new Error(response.data)
  }

  return null
}
