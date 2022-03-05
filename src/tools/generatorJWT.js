import jwt from "jsonwebtoken";

const generatorJWT = (_id, expiresIn) =>
  new Promise((resolve, reject) =>
    jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    })
  );

export default generatorJWT;
