import axios from "axios"

interface UserFriendsWithRequest {
  id: number
}

export const enum RelationshipType {
  NotFriend = "not_friend",
  Friend = "friend",
  Mutual = "mutual",
}

export interface UserFriendsWithResponse {
  code: number
  friend: boolean
  mutual: boolean
}

const userRelationshipsApiInstance = axios.create({
  baseURL: process.env.REACT_APP_USER_RELATIONSHIPS_API_BASE_URL,
})

export const fetchUserFriendsWith = async (
  request: UserFriendsWithRequest
): Promise<UserFriendsWithResponse> => {
  try {
    const response = await userRelationshipsApiInstance.get(
      "/v1/friends/with",
      {
        params: {
          id: request.id,
        },
        // TODO: attach the auth cookie(s)
      }
    )
    return {
      code: response.status,
      friend: response.data.friend,
      mutual: response.data.mutual,
    }
  } catch (e: any) {
    throw new Error("Failed to fetch user friends data from server")
  }
}
