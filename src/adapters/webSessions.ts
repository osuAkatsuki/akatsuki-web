import { type WebSession } from "../interfaces/webSessions";
import type { Success, Failure } from "../interfaces/api";

// TODO: implement retry logic

const deserializeSuccessResponse = (responseData: any): Success<WebSession> => {
  return {
    status: "success",
    data: {
      webSessionId: responseData.data.web_session_id,
      accountId: responseData.data.account_id,
      expiresAt: new Date(responseData.data.expires_at),
      createdAt: new Date(responseData.data.created_at),
      updatedAt: new Date(responseData.data.updated_at),
    },
    meta: {
      page: responseData.meta.page,
      pageSize: responseData.meta.page_size,
      total: responseData.meta.total,
    },
  };
};

const deserializeFailureResponse = (responseData: any): Failure => {
  return {
    status: "error",
    message: responseData.message,
    error: responseData.error,
  };
};

export const login = async (
  username: string,
  password: string,
  recaptchaToken: string
): Promise<Success<WebSession> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/web_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        recaptcha_token: recaptchaToken,
      }),
    });
    const responseData: Success<WebSession> | Failure = await response.json();
    if (!response.ok || responseData.status !== "success") {
      console.error("An error occurred while processing the response.", responseData);
      return deserializeFailureResponse(responseData);
    }
    return deserializeSuccessResponse(responseData);
  } catch (error) {
    return {
      status: "error",
      message: "internal_server_error",
      error: "An unhandled error occurred while processing the response.",
    };
  }
};

export const logout = async (webSessionId: string): Promise<Success<WebSession> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/web_sessions`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${webSessionId}`,
        "Content-Type": "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
    });
    const responseData: Success<WebSession> | Failure = await response.json();
    if (!response.ok || responseData.status !== "success") {
      console.error("An error occurred while processing the response.", responseData);
      return deserializeFailureResponse(responseData);
    }
    return deserializeSuccessResponse(responseData);
  } catch (error) {
    return {
      status: "error",
      error: "internal_server_error",
      message: "An unhandled error occurred while processing the response.",
    };
  }
};
