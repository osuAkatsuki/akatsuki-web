import { type Account } from "../interfaces/accounts";
import type { Success, Failure } from "../interfaces/api";

// !! TODO: refactor users-service to be ONLY based
// on sessions and share accounts with the osu! server

// TODO: implement retry logic

const deserializeSuccessResponse = (responseData: any): Success<Account> => {
  return {
    status: "success",
    data: {
      accountId: responseData.data.account_id,
      username: responseData.data.username,
      privileges: responseData.data.privileges,
      country: responseData.data.country,
      silenceEnd: new Date(responseData.data.silence_end),
      createdAt: new Date(responseData.data.created_at),
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
    error: responseData.error,
    message: responseData.message,
  };
};

export const createAccount = async (
  username: string,
  emailAddress: string,
  password: string,
  country: string,
  recaptchaToken: string
): Promise<Success<Account> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
      body: JSON.stringify({
        username: username,
        email_address: emailAddress,
        password: password,
        country: country,
        recaptcha_token: recaptchaToken,
      }),
    });
    const responseData: Success<Account> | Failure = await response.json();
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

export const fetchOneAccount = async (accountId: number): Promise<Success<Account> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(`${baseUrl}/v1/accounts/${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "basic-frontend/v0.0.1",
      },
    });
    const responseData: Success<Account> | Failure = await response.json();
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

export const fetchManyAccounts = async (
  page: number,
  pageSize: number
): Promise<Success<Account[]> | Failure> => {
  try {
    const baseUrl = process.env.REACT_APP_OSU_SERVICE_API_URL;
    const response = await fetch(
      // TODO: can we clean up the query args?
      `${baseUrl}/v1/accounts?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "basic-frontend/v0.0.1",
        },
      }
    );
    const responseData: Success<Account[]> | Failure = await response.json();
    if (!response.ok || responseData.status !== "success") {
      console.error("An error occurred while processing the response.", responseData);
      return deserializeFailureResponse(responseData);
    }
    return {
      status: "success",
      data: responseData.data.map((account: any): Account => {
        return {
          accountId: account.account_id,
          username: account.username,
          privileges: account.privileges,
          country: account.country,
          silenceEnd: new Date(account.silence_end),
          createdAt: new Date(account.created_at),
        };
      }),
      meta: {
        page: responseData.meta.page,
        pageSize: responseData.meta.page_size,
        total: responseData.meta.total,
      },
    };
  } catch (error) {
    return {
      status: "error",
      error: "internal_server_error",
      message: "An unhandled error occurred while processing the response.",
    };
  }
};
