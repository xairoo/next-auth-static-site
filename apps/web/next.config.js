const withTM = require("next-transpile-modules")(["next-static-site-auth"]);

module.exports = withTM({
  reactStrictMode: true,
});
