import createHttpError from "http-errors";
import userModel from "../schemas/user.js";

const loginMiddleware = async (req, res, next) => {
  if (req.body.identifier && req.body.password) {
    const { identifier, password } = req.body;
    const user = await userModel.authenticate(identifier, password);

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

export default loginMiddleware;
