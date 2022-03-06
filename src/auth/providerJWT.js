import createHttpError from "http-errors";
import generatorJWT from "../tools/generatorJWT.js";
import { User } from "../db/models/index.js";

const providerJWT = async (req, res, next) => {
  const id = req.userID;
  const role = req.userRole;

  try {
    if (id) {
      const accessToken = await generatorJWT({ id, role }, "15m");
      const refreshToken = await generatorJWT({ id, role }, "2w");

      if (accessToken && refreshToken) {
        const user = await User.update(
          { refreshToken },
          {
            where: { id },
            returning: true,
          }
        );
        if (user[0] > 0 && user[1] && user[1][0]?.dataValues) {
          req.tokens = { accessToken, refreshToken };
          next();
        } else {
          next(createHttpError(404, "User not found"));
        }
      } else {
        next(createHttpError(500, "Failed to generate JWT tokens"));
      }
    } else {
      next(createHttpError(400, "User not provided"));
    }
  } catch (error) {
    next(error);
  }
};

export default providerJWT;
