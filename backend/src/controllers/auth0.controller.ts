// import jwt from "jsonwebtoken";
// import prisma from "../lib/prisma";

// export const auth0Callback = async (req: any, res: any) => {
//   const auth0User = req.user as any;
//   const flow = req.query.state; // "login" or "register"

//   const email = auth0User.emails[0].value;

//   const existingUser = await prisma.user.findUnique({
//     where: { email },
//   });

//   // 🔹 LOGIN FLOW
//   if (flow === "login") {
//     if (!existingUser) {
//       return res.redirect(
//         "http://localhost:3000/login?error=user_not_found"
//       );
//     }
//   }

//   // 🔹 REGISTER FLOW
//   if (flow === "register") {
//     if (existingUser) {
//       return res.redirect(
//         "http://localhost:3000/login?error=user_already_exists"
//       );
//     }
//   }

//   // 🔹 CREATE USER (only for register)
//   const user =
//     existingUser ??
//     (await prisma.user.create({
//       data: {
//         name: auth0User.displayName || "Google User",
//         email,
//         auth0Id: auth0User.id,
//         provider: "google",
//       },
//     }));

//   // 🔹 ISSUE JWT
//   const token = jwt.sign(
//     { id: user.id },
//     process.env.JWT_SECRET!,
//     { expiresIn: "7d" }
//   );

//   res.cookie("access_token", token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//     path: "/",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   return res.redirect("http://localhost:3000/");
// };


// export const auth0Callback = async (req: any, res: any) => {
//   const auth0User = req.user as any;
//   const email = auth0User.emails[0].value;

//   const isRegister = req.originalUrl.includes("/register");

//   const existingUser = await prisma.user.findUnique({ where: { email } });

//   if (!isRegister && !existingUser) {
//     return res.redirect(
//       "http://localhost:3000/login?error=user_not_found"
//     );
//   }

//   if (isRegister && existingUser) {
//     return res.redirect(
//       "http://localhost:3000/login?error=user_already_exists"
//     );
//   }

//   const user =
//     existingUser ??
//     (await prisma.user.create({
//       data: {
//         email,
//         name: auth0User.displayName,
//         auth0Id: auth0User.id,
//         provider: "google",
//       },
//     }));

//   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
//     expiresIn: "7d",
//   });

//   res.cookie("access_token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     path: "/",
//   });

//   return res.redirect("http://localhost:3000/");
// };

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

export const auth0Callback = async (req: Request, res: Response) => {
  const auth0User = req.user as any;

  try {
    // 1️⃣ Find or create user
    const user = await prisma.user.upsert({
      where: {
        email: auth0User.emails[0].value,
      },
      update: {
        auth0Id: auth0User.id,
        provider: "google",
      },
      create: {
        name: auth0User.displayName || "Google User",
        email: auth0User.emails[0].value,
        auth0Id: auth0User.id,
        provider: "google",
      },
    });

    // 2️⃣ Create YOUR JWT (same as loginUser)
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 3️⃣ Set cookie (same config)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 4️⃣ Redirect to frontend
    return res.redirect("http://localhost:3000");
  } catch (error) {
    return res.redirect("http://localhost:3000/login?error=auth0");
  }
};
