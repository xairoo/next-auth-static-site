import React from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import {
  tokenType,
  Session,
  LoginOptions,
  LoginUrlOptions,
  UseLoginReturn,
  LogoutOptions,
  UseLogoutReturn,
} from "./types";
import {
  NEXT_PUBLIC_AUTH_API_LOGIN,
  NEXT_PUBLIC_AUTH_API_REFRESH,
  NEXT_PUBLIC_AUTH_API_LOGOUT,
  NEXT_PUBLIC_AUTH_LOGIN_PAGE_SLUG,
  NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG,
} from "./options";
import { useAuthContext } from "./context";

/**
 *
 */
export class AuthToken {
  decodedToken: { exp: any; user_id: null | string };
  token: tokenType;

  constructor(token: string) {
    this.token = undefined;
    this.decodedToken = { user_id: null, exp: 0 };

    // Decode the JWT
    try {
      if (token) {
        this.token = token;
        this.decodedToken = jwtDecode(token);
      }
    } catch (e) {}
  }

  get expiresAt() {
    return new Date(this.decodedToken.exp * 1000);
  }

  get isExpired() {
    return new Date() > this.expiresAt;
  }

  get isAuthenticated() {
    return !this.isExpired;
  }
}

/**
 * @todo
 * Refresh auth token before it expires
 */
export function useRefreshHelper() {
  const hasWindow = typeof window !== "undefined";

  React.useEffect(() => {
    if (hasWindow) {
      // console.log("sessionHelper");
    }
  }, [hasWindow]);
}

// Prevent multiple refresh token requests
let isRefreshing = false;

/**
 * Get the current session
 *
 * @returns {object} Auth `status`, (user) `data`, JWT `token`
 */
export function useSession(): {
  status: undefined | undefined | string;
  data: any;
  token: undefined | null | undefined | null | string;
} {
  const router = useRouter();
  const { state, dispatch } = useAuthContext();

  const { token, data } = state;

  const [session, setSession] = React.useState<Session>({
    status: "loading",
    data: undefined,
    token: undefined,
  });

  const hasWindow = typeof window !== "undefined";

  React.useEffect(() => {
    if (hasWindow) {
      if (!token) {
        setSession({ status: "unauthenticated", data: null, token: null });
      } else {
        const authToken = new AuthToken(token);

        if (data && authToken.isAuthenticated) {
          // User is authenticated
          setSession({
            status: "authenticated",
            data: data,
            token: authToken.token,
          });
        }
        // Refresh expired token?
        else if (authToken.isExpired) {
          const fetchData = async () => {
            try {
              // Token is expired, request a new one
              const res = await fetch(NEXT_PUBLIC_AUTH_API_REFRESH, {
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                mode: "cors",
                method: "GET",
              });

              const authorization = res.headers.get("Authorization");

              let token;
              if (
                data &&
                authorization &&
                authorization.startsWith("Bearer ")
              ) {
                token = authorization.substring(7, authorization.length);

                setSession({
                  status: "authenticated",
                  data: data,
                  token: token,
                });

                localStorage.setItem("auth_token", JSON.stringify(token));

                dispatch({
                  type: "SET_TOKEN",
                  payload: token,
                });
              } else {
                // Auth failed, remove the local session data
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_data");

                dispatch({
                  type: "LOGOUT",
                });

                setSession({
                  status: "unauthenticated",
                  data: null,
                  token: null,
                });
              }
            } catch (err) {
              // Request failed
              // Remove the local session data
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_data");

              dispatch({
                type: "LOGOUT",
              });

              setSession({
                status: "unauthenticated",
                data: null,
                token: null,
              });
            }
            isRefreshing = false;
          };

          if (isRefreshing) {
            return;
          }
          isRefreshing = true;

          fetchData();
        }
      }
    }
  }, [
    router, // Trigger to run when routing to the same site
    hasWindow,
    token,
    data,
    dispatch,
  ]);

  const value = React.useMemo(() => session, [session]);

  return value;
}

/**
 * Perform a login request and store the auth data on success in React context.
 * API should return on success:
 * - Header: Bearer token
 * - Body: User information like name, email, ... to show it on the site e.g. "Logged in as XYZ"
 */
export function useLogin() {
  const { dispatch } = useAuthContext();

  /**
   * @param {object} options - Options object
   * @param {object} options.body - Credentials object, mostly email and password, will be sent to the API login endpoint as a POST request
   * @param {object} [options.url] - Custom API endpoint
   * @param {object} [options.callbackUrl] - A custom callback URL that will be used on success
   * @returns {object} object - The return object
   * @returns {boolean} object.ok - `true` on successful login
   * @returns {number} object.status - HTTP status code from API
   * @returns {string} object.error - Error message
   * @returns {string} object.callbackUrl - A callback url from the options object or from API (overwrites)
   */
  return async (options: LoginOptions): Promise<UseLoginReturn> => {
    try {
      const response = await fetch(
        options.url && typeof options.url === "string"
          ? options.url
          : NEXT_PUBLIC_AUTH_API_LOGIN,
        {
          body: JSON.stringify({ ...options.body }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          method: "POST",
        }
      );

      // Handle fetch error
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: response.statusText,
          callbackUrl: null,
        };
      }

      const authorization = response.headers.get("Authorization");

      // Authorization header is required
      if (!authorization) {
        return {
          ok: false,
          status: response.status,
          error: "Authorization missing",
          callbackUrl: null,
        };
      }

      // Get the token
      let token;
      if (authorization.startsWith("Bearer ")) {
        token = authorization.substring(7, authorization.length);
      } else {
        // Bearer token missing
        return {
          ok: false,
          status: response.status,
          error: "Bearer token missing",
          callbackUrl: null,
        };
      }

      // Get JSON body
      let data;
      try {
        data = await response.json();
      } catch (error: any) {
        // Failed
        return {
          ok: false,
          status: response.status,
          error: "JSON.parse failed",
          callbackUrl: error
            ? null
            : options && options.callbackUrl
            ? options?.callbackUrl
              ? options.callbackUrl.toString()
              : null
            : null,
        };
      }

      // Set callbackUrl priority:
      // 1.) From API
      // 2.) From options
      // 3.) null if none of the above is given
      const callbackUrl = data.callbackUrl
        ? data.callbackUrl
        : options && options.callbackUrl
        ? options.callbackUrl
        : null;

      // Remove callbackUrl from object
      delete data.callbackUrl;

      // Store token and data in localStorage
      localStorage.setItem("auth_token", JSON.stringify(token));
      localStorage.setItem("auth_data", JSON.stringify(data));

      // Finally set context
      dispatch({
        type: "SET_SESSION",
        payload: { token: token, data: data },
      });

      // Success
      return {
        ok: true,
        status: response.status,
        error: undefined,
        callbackUrl: callbackUrl ? callbackUrl : null,
      };
    } catch (err: any) {
      // Request failed
      return {
        ok: false,
        status: null,
        error: err.message,
        callbackUrl: null,
      };
    }
  };
}

/**
 * Logout function
 * Optional: Performs an API request (e.g. to remove stored session from DB), default: true
 */
export function useLogout() {
  const router = useRouter();
  const { dispatch } = useAuthContext();

  /**
   * @param {object} [options] - Options object
   * @param {object} [options.apiRequest] - Custom API endpoint
   * @param {object} [options.callbackUrl] - A custom callback URL that will be used on success, e.g. if you want to show a logged out page
   * @returns {object} object - The return object
   * @returns {boolean} object.ok - `true` on successful login
   * @returns {number} object.status - HTTP status code from API
   * @returns {string} object.error - Error message
   */
  return async (options?: LogoutOptions): Promise<UseLogoutReturn> => {
    let response = { status: null, error: undefined };

    // API request needed to logout?
    if (options?.apiRequest !== false) {
      try {
        await fetch(NEXT_PUBLIC_AUTH_API_LOGOUT, {
          credentials: "include",
          mode: "cors",
        });
      } catch (err: any) {
        // Request failed
        // @todo
      }
    }

    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_data");

    // Finally reset context
    dispatch({
      type: "LOGOUT",
    });

    if (options?.callbackUrl) {
      await router.push(options?.callbackUrl);
    }

    return {
      ok: true,
      status: response.status,
      error: undefined,
    };
  };
}

/**
 * @param {object} [options] - Options object
 * @param {string} [options.pathname] - Login pathname, callbackUrl will be added if wanted
 * @param {string} [options.callbackUrl] - Custom callback URL, set `false` to disable callbackUrl
 */
export function loginUrl(options?: LoginUrlOptions): string {
  const hasWindow = typeof window !== "undefined";

  const urlBase = hasWindow
    ? window.location.origin + window.location.pathname
    : "";

  let callbackUrl;
  if (options?.callbackUrl === false) {
    // No `callbackUrl` parameter will be added
  } else if (options?.callbackUrl) {
    // Custom `callbackUrl`
    callbackUrl = options.callbackUrl;
  } else {
    // Don't redirect to logged-out or login page
    callbackUrl =
      hasWindow &&
      (urlBase.includes(NEXT_PUBLIC_AUTH_LOGIN_PAGE_SLUG) ||
        urlBase.includes(NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG))
        ? window.location.origin
        : window.location.href;
  }

  const loginUrl = `${
    options && options.pathname ? options.pathname : "/login"
  }${hasWindow && callbackUrl ? `?` : ``}${new URLSearchParams({
    ...(hasWindow &&
      callbackUrl && {
        callbackUrl: callbackUrl,
      }),
  })}`;

  return loginUrl;
}
