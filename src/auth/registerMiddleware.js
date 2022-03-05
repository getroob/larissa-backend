import createHttpError from "http-errors";
import UserModel from "../schemas/user.js";

const registerMiddleware = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new UserModel({ firstName, lastName, email, password });
    const createdUser = await newUser.save();

    if (createdUser) {
      const { _id } = createdUser.toJSON();
      req.userID = _id;

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
