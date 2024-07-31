/* eslint-disable prettier/prettier */
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
  withCredentials: true,
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

interface AddRemoveFriendRequest {
  user: number
  add: boolean
}

export interface AddRemoveFriendResponse {
  code: number
  friend: boolean
  mutual: boolean
}

export const addRemoveFriend = async (
  request: AddRemoveFriendRequest
): Promise<AddRemoveFriendResponse> => {
  try {
    const response = await userRelationshipsApiInstance.post(
      `v1/friends/${request.add ? "add" : "del"}`,
      { user: request.user }
    )
    return {
      code: response.status,
      friend: response.data.friend,
      mutual: response.data.mutual,
    }
  } catch (e: any) {
    throw new Error("Failed to add friend")
  }
}
