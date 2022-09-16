// Set `NEXT_PUBLIC_AUTH_API_LOGIN` from env, otherwise use default value
const NEXT_PUBLIC_AUTH_API_LOGIN = process.env.NEXT_PUBLIC_AUTH_API_LOGIN
  ? process.env.NEXT_PUBLIC_AUTH_API_LOGIN
  : "http://localhost:5000/auth/login";

// Set `NEXT_PUBLIC_AUTH_API_REFRESH` from env, otherwise use default value
const NEXT_PUBLIC_AUTH_API_REFRESH = process.env.NEXT_PUBLIC_AUTH_API_REFRESH
  ? process.env.NEXT_PUBLIC_AUTH_API_REFRESH
  : "http://localhost:5000/auth/refresh";

// Set `NEXT_PUBLIC_AUTH_API_LOGOUT` from env, otherwise use default value
const NEXT_PUBLIC_AUTH_API_LOGOUT = process.env.NEXT_PUBLIC_AUTH_API_LOGOUT
  ? process.env.NEXT_PUBLIC_AUTH_API_LOGOUT
  : "http://localhost:5000/auth/logout";

// Set `NEXT_PUBLIC_AUTH_API_LOGOUT` from env, otherwise use default value
const NEXT_PUBLIC_AUTH_LOGIN_PAGE = process.env.NEXT_PUBLIC_AUTH_LOGIN_PAGE
  ? process.env.NEXT_PUBLIC_AUTH_LOGIN_PAGE
  : "http://localhost:3000/login";

// Set `NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG` from env, otherwise use default value
const NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG = process.env
  .NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG
  ? process.env.NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG
  : "logged-out";

export {
  NEXT_PUBLIC_AUTH_API_LOGIN,
  NEXT_PUBLIC_AUTH_API_REFRESH,
  NEXT_PUBLIC_AUTH_API_LOGOUT,
  NEXT_PUBLIC_AUTH_LOGIN_PAGE,
  NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG,
};
