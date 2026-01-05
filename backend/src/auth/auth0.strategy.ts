import passport from "passport";
import { Strategy as Auth0Strategy } from "passport-auth0";

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN!,
      clientID: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      callbackURL: process.env.AUTH0_CALLBACK_URL!,

      state: true, // ✅ REQUIRED
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      return done(null, profile);
    }
  )
);

// required by passport (even if you don't use sessions for auth)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

export default passport;
