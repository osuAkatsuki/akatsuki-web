import axios from "axios"

const searchApiInstance = axios.create({
  baseURL: process.env.REACT_APP_SEARCH_API_BASE_URL,
})

interface SearchRequest {
  query: string
}

export interface SingleUserSearchResult {
  id: number
  username: string
}

export interface SearchResponse {
  code: number
  users: SingleUserSearchResult[] | null
}

export const searchUsers = async (
  request: SearchRequest
): Promise<SearchResponse> => {
  try {
    const response = await searchApiInstance.get("/v1/users/lookup", {
      params: {
        name: request.query,
      },
    })
    return {
      code: response.data.code,
      users:
        response.data.users?.map((user: any) => ({
          id: user.id,
          username: user.username,
        })) ?? null,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
