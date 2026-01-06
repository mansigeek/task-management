import express from "express";
import passport from "passport";
import { googleSmartAuth } from "../controllers/auth0.google.smart";
import { githubSmartAuth } from "../controllers/auth0.github.smart";

const auth0Router = express.Router();

auth0Router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

auth0Router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleSmartAuth
);

auth0Router.get(
  "/github",
  passport.authenticate("github")
);

auth0Router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  githubSmartAuth
);


export default auth0Router;
