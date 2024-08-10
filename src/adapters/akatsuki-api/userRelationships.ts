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
      code: response.data.code,
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
      code: response.data.code,
      friend: response.data.friend,
      mutual: response.data.mutual,
    }
  } catch (e: any) {
    throw new Error("Failed to add friend")
  }
}

interface UserFriendsRequest {
  page: number
  pageSize: number
}

export interface UserFriend {
  id: number
  username: string
  username_aka: string
  registered_on: Date
  privileges: number
  latest_activity: Date
  country: string
  is_mutual: boolean
}

export interface UserFriendsResponse {
  code: number
  friends: UserFriend[]
}

export const fetchUserFriends = async (
  request: UserFriendsRequest
): Promise<UserFriendsResponse> => {
  try {
    const response = await userRelationshipsApiInstance.get("/v1/friends", {
      params: {
        p: request.page,
        l: request.pageSize,
        sort: "username,asc",
      },
    })
    return {
      code: response.data.code,
      friends: response.data.friends.map((friend: any) => {
        return {
          id: friend.id,
          username: friend.username,
          username_aka: friend.username_aka,
          registered_on: new Date(friend.registered_on),
          privileges: friend.privileges,
          latest_activity: new Date(friend.latest_activity),
          country: friend.country,
          is_mutual: friend.is_mutual,
        }
      }),
    }
  } catch (e: any) {
    throw new Error("Failed to fetch user friends data from server")
  }
}
