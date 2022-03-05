import { Router } from "express";
import providerJWT from "../auth/providerJWT.js";
import loginMiddleware from "../auth/loginMiddleware.js";
import refreshMiddleware from "../auth/refreshMiddleware.js";
import registerMiddleware from "../auth/registerMiddleware.js";
import sendCookies from "../auth/sendCookies.js";
import authValidator from "../auth/authValidator.js";
import UserModel from "../schemas/user.js";
import createHttpError from "http-errors";

const userRouter = Router();

userRouter.post("/register", registerMiddleware, providerJWT, sendCookies);
userRouter.post("/login", loginMiddleware, providerJWT, sendCookies);
userRouter.post("/refresh", refreshMiddleware, providerJWT, sendCookies);
userRouter.post("/logout", async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken", {
        path: "/users/refresh",
      })
      .send({ logout: true });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", authValidator, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userID);

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
