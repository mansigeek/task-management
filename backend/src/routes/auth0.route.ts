import passport from "passport";
import {  oauthLoginSuccess } from "../controllers/auth0.controller";
import express from "express";

const auth0Router = express.Router();

auth0Router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  auth0Router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "http://localhost:3000/login?error=no_user",
    }),
    oauthLoginSuccess
  );

export default auth0Router;