import createHttpError from "http-errors";
import validatorJWT from "../tools/validatorJWT.js";

const authValidator = async (req, res, next) => {
  try {
    if (req.cookies.accessToken) {
      const payload = await validatorJWT(req.cookies.accessToken);
      if (payload?.id && payload?.role) {
        req.userID = payload.id;
        req.userRole = payload.role;
        next();
      } else {
        next(createHttpError(401, "Token not valid"));
      }
    } else {
      next(createHttpError(401, "No access token"));
    }
  } catch (error) {
    next(error);
  }
};

export default authValidator;
