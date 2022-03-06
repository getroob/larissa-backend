import createHttpError from "http-errors";
import { User } from "../db/models/index.js";

const refreshMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ where: { refreshToken } });
    // const user = await userModel.findOne({ refreshToken });
    console.log(user?.dataValues);

    if (user?.dataValues) {
      req.userID = user?.dataValues?.id;
      req.userRole = user?.dataValues?.role;
      next();
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } else {
    next(createHttpError(401, "Please provide credentials!"));
  }
};

export default refreshMiddleware;
