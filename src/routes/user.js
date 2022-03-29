import { Router } from "express";
import providerJWT from "../auth/providerJWT.js";
import loginMiddleware from "../auth/loginMiddleware.js";
import refreshMiddleware from "../auth/refreshMiddleware.js";
import registerMiddleware from "../auth/registerMiddleware.js";
import sendCookies from "../auth/sendCookies.js";
import authValidator from "../auth/authValidator.js";
import createHttpError from "http-errors";
import { User } from "../db/models/index.js";

const userRouter = Router();

userRouter.post("/register", registerMiddleware, providerJWT, sendCookies);
userRouter.post("/login", loginMiddleware, providerJWT, sendCookies);
userRouter.post("/refresh", refreshMiddleware, providerJWT, sendCookies);
userRouter.post("/logout", async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.ENV === "production", // only https requests
        sameSite: "None",
      })
      .clearCookie("refreshToken", {
        path: "/users/refresh",
        httpOnly: true,
        secure: process.env.ENV === "production", // only https requests
        sameSite: "None",
      })
      .send({ logout: true });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/refugees", authValidator, async (req, res, next) => {
  try {
    if (req.userRole === "municipality") {
      const user = await User.findAll({
        where: {
          role: "refugee",
        },
        attributes: ["id", "firstName", "lastName", "email"],
      });

      if (user) {
        res.send(user);
      } else {
        next(createHttpError(404, "User not found"));
      }
    } else {
      next(createHttpError(403, "You dont have access to this info"));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", authValidator, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userID, {
      attributes: ["id", "firstName", "lastName", "email", "role"],
    });

    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
