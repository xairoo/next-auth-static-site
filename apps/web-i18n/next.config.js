const packageJSON = require("./package.json");

const withTM = require("next-transpile-modules")(["next-auth-static-site"]);

module.exports = withTM({
  reactStrictMode: true,
  env: {
    // Just for the example
    NEXT_PUBLIC_EXAMPLE_NAME: packageJSON.name,
    NEXT_PUBLIC_EXAMPLE_VERSION: packageJSON.version,
    NEXT_PUBLIC_NEXT_VERSION: packageJSON.dependencies.next,

    // next-auth-static-site config
    NEXT_PUBLIC_AUTH_API_LOGIN: "http://localhost:5000/auth/login",
    NEXT_PUBLIC_AUTH_API_REFRESH: "http://localhost:5000/auth/refresh",
    NEXT_PUBLIC_AUTH_API_LOGOUT: "http://localhost:5000/auth/logout",
    NEXT_PUBLIC_DATA_URL: "http://localhost:5000/data",
  },
});
