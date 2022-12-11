# Options

You have to set a few environment variables to define your REST API endpoints inside `.env.local` (or what ever you use) and you can define a custom login and logged out URL.

- [API_LOGIN](#next_public_auth_api_login)
- [API_REFRESH](#next_public_auth_api_refresh)
- [API_LOGOUT](#next_public_auth_api_logout)
- [LOGIN_PAGE_SLUG](#next_public_auth_login_page_slug)
- [LOGGED_OUT_PAGE_SLUG](#next_public_auth_logged_out_page_slug)

## NEXT_PUBLIC_AUTH_API_LOGIN

```
NEXT_PUBLIC_AUTH_API_LOGIN=http://localhost:5000/auth/login
```

The URL to your login endpoint.

## NEXT_PUBLIC_AUTH_API_REFRESH

```
NEXT_PUBLIC_AUTH_API_REFRESH=http://localhost:5000/auth/refresh
```

The URL to your refresh token endpoint.

## NEXT_PUBLIC_AUTH_API_LOGOUT

```
NEXT_PUBLIC_AUTH_API_LOGOUT=http://localhost:5000/auth/logout
```

The URL to your logout endpoint (e.g. if you want to remove any stored session data from your API).  
Can be set to `false` to disable the logout API request globally.

## NEXT_PUBLIC_AUTH_LOGIN_PAGE_SLUG

```
NEXT_PUBLIC_AUTH_LOGIN_PAGE_SLUG=/login
```

This slug helps to prevent generating a callback URL for the login URL that points to the login page.

## NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG

```
NEXT_PUBLIC_AUTH_LOGGED_OUT_PAGE_SLUG=/logged-out
```

This slug helps to prevent generating a callback URL for the login URL that points to the logged out page.
