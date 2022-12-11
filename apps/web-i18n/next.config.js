const withTM = require("next-transpile-modules")(["next-auth-static-site"]);

module.exports = withTM({
  reactStrictMode: true,
  publicRuntimeConfig: {
    i18n: {
      languages: ["en", "de"],
      defaultLanguage: "en",
      namespaces: ["common", "meta", "error"],
      defaultNamespace: "common",
    },
  },
  env: {
    NEXT_PUBLIC_AUTH_API_LOGIN: "http://localhost:5000/auth/login",
    NEXT_PUBLIC_AUTH_API_REFRESH: "http://localhost:5000/auth/refresh",
    NEXT_PUBLIC_AUTH_API_LOGOUT: "http://localhost:5000/auth/logout",
    NEXT_PUBLIC_DATA_URL: "http://localhost:5000/data",
  },
});
