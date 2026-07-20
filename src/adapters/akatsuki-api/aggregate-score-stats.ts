import axios from "axios"

const aggregateScoreStatsApiInstance = axios.create({
  baseURL: process.env.REACT_APP_AGGREGATE_SCORE_STATS_API_BASE_URL,
})

export const fetchTotalScoresSet = async (): Promise<number> => {
  try {
    const response = await aggregateScoreStatsApiInstance.get(
      "/v1/aggregate-score-stats/total-scores-set"
    )
    return response.data
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
