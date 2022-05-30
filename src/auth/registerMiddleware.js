import createHttpError from "http-errors";
import { User } from "../db/models/index.js";
import encryptPassword from "../tools/encryptPassword.js";
import generatorJWT from "../tools/generatorJWT.js";
import sendEmail from "../tools/sendEmail.js";

const registerMiddleware = async (req, res, next) => {
  try {
    const token = await generatorJWT({ email: req.body.email }, "2w")
    const verificationLink = `${process.env.FE_URL}/verifyEmail/${token}`
    // await sendEmail('Please verify your email', `You can verify your email here ${verificationLink}. It is valid for 2 weeks`, req.body.email)

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
