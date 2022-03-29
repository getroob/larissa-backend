const sendCookies = async (req, res, next) => {
  console.log(process.env.ENV, process.env.ENV === "production");
  try {
    res
      .cookie("accessToken", req.tokens?.accessToken, {
        // domain: process.env.FE_URL,
        httpOnly: true,
        secure: process.env.ENV === "production", // only https requests
        maxAge: 15 * 60 * 1000,
        sameSite: "None",
      })
      .cookie("refreshToken", req.tokens?.refreshToken, {
        // domain: process.env.FE_URL,
        path: "/users/refresh",
        httpOnly: true,
        secure: process.env.ENV === "production", // only https requests
        maxAge: 14 * 24 * 60 * 60 * 1000,
        sameSite: "None",
      })
      .send({ login: true, userID: req.userID });
  } catch (error) {
    next(error);
  }
};

export default sendCookies;
