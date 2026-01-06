import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:2000/auth/google/callback",
    },
    async (_: any, __: any, profile: any, done: any) => {
      done(null, profile);
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:2000/auth/github/callback",
      scope: ["user:email"],
    },
    async (_: any, __: any, profile: any, done: any) => {
      done(null, profile);
    }
  )
);

