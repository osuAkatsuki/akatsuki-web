import axios from "axios"

import type { Identity } from "../../context/identity"

const authApiInstance = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_BASE_URL,
  withCredentials: true,
})

export const authenticate = async (
  username: string,
  password: string,
  recaptchaToken: string
): Promise<Identity> => {
  try {
    const response = await authApiInstance.post("/api/v1/authenticate", {
      username,
      password,
      recaptcha_token: recaptchaToken,
    })
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

export const initPasswordReset = async (
  username: string,
  recaptchaToken: string
): Promise<void> => {
  try {
    await authApiInstance.post("/api/v1/init-password-reset", {
      username,
      recaptcha_token: recaptchaToken,
    })
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}

export const verifyPasswordReset = async (
  hashedToken: string,
  newPassword: string
): Promise<void> => {
  try {
    await authApiInstance.post("/api/v1/verify-password-reset", {
      hashed_password_reset_token: hashedToken,
      new_password: newPassword,
    })
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
