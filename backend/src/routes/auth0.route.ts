import { Router } from "express";
import passport from "../auth/auth0.strategy";
import { auth0Callback } from "../controllers/auth0.controller";

const auth0Router = Router();

// Start Google login
// auth0Router.get(
//   "/auth0/login",
//   passport.authenticate(
//     "auth0",
//     {
//       scope: "openid profile email",
//       connection: "google-oauth2",
//       prompt: "select_account",
//       state: "login", // 👈 identify flow
//     } as any
//   )
// );

// auth0Router.get(
//   "/auth0/register",
//   passport.authenticate(
//     "auth0",
//     {
//       scope: "openid profile email",
//       connection: "google-oauth2",
//       prompt: "select_account",
//       state: "register", // 👈 identify flow
//     } as any
//   )
// );

auth0Router.get(
  "/auth0",
  passport.authenticate(
    "auth0",
    {
      scope: "openid profile email",
      connection: "google-oauth2",
      prompt: "select_account",
    } as any // 👈 FIX
  )
);

// // Auth0 callback
auth0Router.get(
  "/auth0/callback",
  passport.authenticate("auth0", { session: false }),
  auth0Callback
);

// auth0Router.get(
//   "/auth0/callback",
//   passport.authenticate("auth0"),
//   auth0Callback // 👈 YOU decide login vs register here
// );

export default auth0Router;
