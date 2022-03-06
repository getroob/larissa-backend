import createHttpError from "http-errors";
import { User } from "../db/models/index.js";
import encryptPassword from "../tools/encryptPassword.js";

const registerMiddleware = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const encryptedPassword = await encryptPassword(password);
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      refreshToken: null,
    });

    if (createdUser?.dataValues) {
      req.userID = createdUser?.dataValues?.id;
      req.userRole = createdUser?.dataValues?.role;

      next();
    } else {
      next(createHttpError(400, "failed to create user"));
    }
  } catch (error) {
    if (error.code === 11000) {
      next(
        createHttpError(
          409,
          `User already exists, try a different ${Object.keys(
            error.keyPattern
          ).join("/")}`
        )
      );
    } else {
      next(error);
    }
  }
};

export default registerMiddleware;
