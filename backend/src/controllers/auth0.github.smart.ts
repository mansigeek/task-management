import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

export const githubSmartAuth = async (req: Request, res: Response) => {
  const profile = req.user as any;

  // GitHub may hide email → pick primary verified email
  const email =
    profile.emails?.find((e: any) => e.primary)?.value ||
    profile.emails?.[0]?.value;

  if (!email) {
    return res.redirect("http://localhost:3000/login?error=no_email");
  }

  // 1️⃣ Already linked with GitHub
  let user = await prisma.user.findFirst({
    where: {
      provider: "github",
      auth0Id: profile.id,
    },
  });

  // 2️⃣ Email exists → link GitHub
  if (!user) {
    const emailUser = await prisma.user.findUnique({
      where: { email },
    });

    if (emailUser) {
      user = await prisma.user.update({
        where: { id: emailUser.id },
        data: {
          provider: "github",
          auth0Id: profile.id,
        },
      });
    }
  }

  // 3️⃣ New user → create
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: profile.displayName || profile.username,
        email,
        provider: "github",
        auth0Id: profile.id,
      },
    });
  }

  // 4️⃣ Issue JWT (same as Google)
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:3000/");
};
