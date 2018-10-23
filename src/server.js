const url = require("url");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const compression = require("compression");
const nextApp = require("next");
const axios = require("axios");
const { useStaticRendering } = require("mobx-react");
const logger = require("lib/logger");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const refresh = require("passport-oauth2-refresh");
const { decodeOpaqueId } = require("lib/utils/decoding");
const { appPath, dev, enableRedirects } = require("./config");
const router = require("./routes");

const app = nextApp({ dir: appPath, dev });
const routeHandler = router.getRequestHandler(app);

// This is needed to allow custom parameters (e.g loginActions) to be included
// when requesting authorization. This is setup to allow only loginAction to pass through
OAuth2Strategy.prototype.authorizationParams = function (options = {}) {
  return { loginAction: options.loginAction };
};

useStaticRendering(true);

passport.use("oauth2", new OAuth2Strategy({
  authorizationURL: process.env.OAUTH2_AUTH_URL,
  tokenURL: process.env.OAUTH2_TOKEN_URL,
  clientID: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.OAUTH2_REDIRECT_URL,
  state: true,
  scope: ["offline"]
}, (accessToken, refreshToken, profile, cb) => {
  cb(null, { accessToken, profile });
}));

passport.use("refresh", refresh);

// The value passed to `done` here is stored on the session.
// We save the full user object in the session.
passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

// The value returned from `serializeUser` is passed in from the session here,
// to get the user. We save the full user object in the session.
passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

const redirectRules = {};
const redirectMiddlewre = (req, res, next) => {
  const path = url.parse(req.url).pathname.replace(/\/$/, "");
  const rule = redirectRules[path];

  // If no redirect necessary, continue along as normal
  if (!rule || (path === rule.to)) return next();

  // Redirect to specified url
  res.writeHead(rule.status, {
    Location: rule.to
  });
  return res.end();
};

/**
 * Fetches a full manifest of redirects from a GraphQL endpoint
 * @returns {Promise} a promise containing the response from the GQL request
 */
const fetchRouteManifest = async () => {
  if (enableRedirects === false) return Promise.resolve();

  try {
    const res = await axios.post(process.env.INTERNAL_GRAPHQL_URL, {
      query: "query { redirectRules { status from to } }",
      variables: null
    });

    const rules = res.data.data.redirectRules;
    for (const rule of rules) {
      redirectRules[rule.from] = rule;
    }
    return res;
  } catch (err) {
    logger.error("Redirect rule request failed", err);
    throw err;
  }
};

app
  .prepare()
  .then(fetchRouteManifest)
  .then(() => {
    const server = express();

    server.use(compression());

    const { SESSION_SECRET, SESSION_MAX_AGE_MS } = process.env;
    const maxAge = SESSION_MAX_AGE_MS ? Number(SESSION_MAX_AGE_MS) : 24 * 60 * 60 * 1000; // 24 hours

    // We use a client-side cookie session instead of a server session so that there are no
    // issues when load balancing without sticky sessions.
    // https://www.npmjs.com/package/cookie-session
    server.use(cookieSession({
      // https://www.npmjs.com/package/cookie-session#options
      keys: [SESSION_SECRET],
      maxAge,
      name: "storefront-session"
    }));

    // http://www.passportjs.org/docs/configure/
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(cookieParser());

    if (enableRedirects) {
      server.use(redirectMiddlewre);
    }

    server.get("/signin", (req, res, next) => {
      req.session.redirectTo = req.get("Referer");
      next(); // eslint-disable-line promise/no-callback-in-promise
    }, passport.authenticate("oauth2", { loginAction: "signin" }));

    server.get("/signup", (req, res, next) => {
      req.session.redirectTo = req.get("Referer");
      next(); // eslint-disable-line promise/no-callback-in-promise
    }, passport.authenticate("oauth2", { loginAction: "signup" }));

    // This endpoint handles OAuth2 requests (exchanges code for token)
    server.get("/callback", passport.authenticate("oauth2"), (req, res) => {
      // After success, redirect to the page we came from originally
      res.redirect(req.session.redirectTo || "/");
    });

    server.get("/logout/:userId", async (req, res) => {
      const { id } = decodeOpaqueId(req.params.userId);

      try {
        await axios.get(`${process.env.OAUTH2_IDP_HOST_URL}logout?userId=${id}`);
        req.logout();
        return res.redirect(req.get("Referer") || "/");
      } catch (err) {
        res.next(err);
      }
    });

    // Setup next routes
    server.use(routeHandler);

    return server.listen(4000, (err) => {
      if (err) throw err;
      logger.appStarted("localhost", 4000);
    });
  })
  .catch((ex) => {
    logger.error(ex.stack);
    process.exit(1);
  });

module.exports = app;
