import createHttpError from "http-errors";
import { User } from "../db/models/index.js";
import authenticatePassword from "../tools/authenticatePassword.js";

const loginMiddleware = async (req, res, next) => {
  if (req.body.identifier && req.body.password) {
    const { identifier, password } = req.body;
    // const user = await userModel.authenticate(identifier, password);
    const user = await User.findOne({ where: { email: identifier } });

    if (user?.dataValues) {
      const isValid = await authenticatePassword(
        password,
        user?.dataValues?.password
      );
      if (isValid) {
        req.userID = user?.dataValues?.id;
        req.userRole = user?.dataValues?.role;
        next();
      } else {
        next(createHttpError(401, "Credentials are not ok!"));
      }
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } else {
    next(createHttpError(401, "Please provide credentials!"));
  }
};

export default loginMiddleware;
