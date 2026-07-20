import axios from "axios"

const aggregateUserStatsApiInstance = axios.create({
  baseURL: process.env.REACT_APP_AGGREGATE_USER_STATS_API_BASE_URL,
})

export const fetchTotalPPEarned = async (): Promise<number> => {
  try {
    const response = await aggregateUserStatsApiInstance.get(
      "/v1/aggregate-user-stats/total-pp-earned"
    )
    return response.data
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}

export const fetchTotalRegisteredUsers = async (): Promise<number> => {
  try {
    const response = await aggregateUserStatsApiInstance.get(
      "/v1/aggregate-user-stats/total-registered-users"
    )
    return response.data
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
