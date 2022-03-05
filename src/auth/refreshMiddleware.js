import createHttpError from "http-errors";
import userModel from "../schemas/user.js";

const refreshMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await userModel.findOne({ refreshToken });

    if (user) {
      req.userID = user._id;
      next();
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } else {
    next(createHttpError(401, "Please provide credentials!"));
  }
};

export default refreshMiddleware;
