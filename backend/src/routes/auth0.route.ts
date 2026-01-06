import express from "express";
import passport from "passport";
import { googleSmartAuth } from "../controllers/auth0.google.smart";

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


export default auth0Router;
