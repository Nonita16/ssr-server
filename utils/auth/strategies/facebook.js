const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const axios = require('axios');
const { config } = require("../../../config/index");

passport.use(new FacebookStrategy({
    clientID: config.facebookClientId,
    clientSecret: config.facebookClientSecret,
    callbackURL: "/auth/facebook/callback",
    profilerFields: ["id", "displayName", "email"]
  },
  async function(accessToken, refreshToken, { _json: profile }, done) {

    const email = profile.email
        ? profile.email
        : `${profile.id}@facebook.com`;

      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: "post",
        data: {
            name: profile.displayName || "nona",
            email: email,
            password: profile.id,
            apiKeyToken: config.apiKeyToken
        }
      });

      if (!data || status !== 200) {
        return done(boom.unauthorized(), false);
      }

      return done(null, data);
  }
));

