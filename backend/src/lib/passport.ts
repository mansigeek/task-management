import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../lib/prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:2000/auth/google/callback",
    },
    async (_, __, profile, done) => {
      const user = await prisma.user.findFirst({
        where: {
          provider: "google",
          auth0Id: profile.id,
        },
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);
