import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config() 

const validatorJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    })
  );

export default validatorJWT;
