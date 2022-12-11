<div align="center">
  <h1>next-static-site-auth</h1>
  <p>A authentication solution for static sites build with Next.js (static HTML export / <code>next export</code>) and your own API authentication endpoint.</p>
</div>

## JWT authentication with a custom API

This package brings authentication to secure your private routes on your static sites build with the `next export` future from Next.js. Your custom API is used to handle the JWT authentication.

A JWT token is used for authentication and as a cookie refresh token.

- Authentication token gets stored in `localStorage` to access private routes and for authenticated API requests
- Refresh token is stored as a `cookie`

## Installation

```
npm install --save next-static-site-auth
```

## Configuration

You have to set a few environment variables to define your REST API endpoints. This can be done for example in `.env.local` or `next.config.js`.

> Check the [options reference](https://github.com/Xairoo/next-static-site-auth/blob/main/packages/next-static-site-auth/OPTIONS.md) for the configuration variables.

## Usage

Implement the `SessionProvider` like this in your `_app.js`:

```js
import { SessionProvider } from "next-static-site-auth";
import "./styles.css";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
```

Now you can secure private/protected sites that requires authentication easily with `useSession()`:

```js
const { status, session, token } = useSession();
```

- `status`: Can be `"loading"`, `"authenticated"` or `"unauthenticated"`.
- `session`: Provides the session/user object returned from the login request.
  - If status is `"loading"`, session will be `undefined`.
  - If status is `"unauthenticated"`, session will be `null`.
  - If status is `"authenticated"`, session will be `object`.
  - Provides the stored object returned from the login request (e.g. the username, email,...).
- `token`: Returns the current JWT auth token.

The [/dashboard](https://github.com/Xairoo/next-static-site-auth/blob/main/apps/web/pages/dashboard.tsx) page is a private page example.

## API requirements

next-static-site-auth will send some data to your API and awaits a specific answer.

> It's up to you to handle all the requests on your API!

So you will need a few routes on your API:

- [Login route](#login-route)
  - [Bearer token](#bearer-token)
  - [Refresh token](#refresh-token)
  - [Body](#body)
- [Refresh Route](#refresh-route)
- [Logout route](#logout-route)

An minimal example API with the required routes is included in this monorepo and is located in [apps/api/](https://github.com/Xairoo/next-static-site-auth/blob/main/apps/api/).

### Login route

`POST /auth/login`

This request body object (`Content-Type: application/json`) will be sent when performing the login request to the API:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Handle the login request and on your API server and return on success:

- JWT auth token (with the header)
- JWT refresh token (as a cookie)
- Body with user data (for the `session` object, can be accessed by the client)

The [JWT](https://jwt.io/) token must contain at least `iat`, `exp` and the `user_id`.

#### Bearer token

The API has to send the bearer token with the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Refresh token

Don't forget to set the JWT refresh token as a `refresh_token` cookie.
Otherwise the client will be unauthenticated after the Bearer token expires because the token can't be refreshed.

#### Body

The Body content must be `Content-Type: application/json` and should contain some user data to display the values on the page.
This could be changed, but the example uses `email` in a few components (`dashboard.tsx` page and `authInfo.tsx` component).

```json
{
  "user_id": "userId",
  "email": "someone@example.com"
}
```

#### Example response snippet from an `express` server:

```js
res.setHeader("Access-Control-Expose-Headers", "Authorization");
res.setHeader("Authorization", "Bearer " + jwtToken);

res.cookie("refresh_token", jwtRefreshToken, {
  path: "/",
  maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_LIFETIME) * 1000,
  httpOnly: true, // Client can't access this cookie with javascript
  sameSite: "Lax",
  secure: process.env.NODE_ENV === "production" ? true : false, // Forces to use https in production
});

res.status(200).json({ email: email, user_id: user_id });
```

### Refresh route

`GET /auth/refresh`

Same as login, but you can skip the body object.

Return:

- [Bearer token](#bearer-token) in the header
- Optional: replace/extend [refresh token](#refresh-token) cookie

### Logout Route

`GET /auth/logout`

- Clear the `refresh_token` cookie
- Any response error will delete the `auth` token stored in `localStorage`

## Example

This monorepo provides a API and a web example:

- [Web](https://github.com/Xairoo/next-static-site-auth/tree/main/apps/web)
- [Web with i18n locale support](https://github.com/Xairoo/next-static-site-auth/tree/main/apps/web-i18n)
- [API](https://github.com/Xairoo/next-static-site-auth/tree/main/apps/api)

Feel free to clone the monorepo and start the examples!

Install all dependencies:

```bash
npm ci
```

Start the development mode

```bash
npm run dev
```

Now you can access the web example on [http://localhost:3000/](http://localhost:3000/) and the API will listen on port [5000](http://localhost:5000/).
