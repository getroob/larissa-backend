import createHttpError from "http-errors";
import validatorJWT from "../tools/validatorJWT.js";

const authValidator = async (req, res, next) => {
  try {
    if (req.cookies.accessToken) {
      const payload = await validatorJWT(req.cookies.accessToken);
      if (payload.id) {
        req.userID = payload.id;
        next();
      } else {
        next(createHttpError(401, "Token not valid"));
      }
    } else {
      next(createHttpError(400, "No access token"));
    }
  } catch (error) {
    next(error);
  }
};

export default authValidator;
