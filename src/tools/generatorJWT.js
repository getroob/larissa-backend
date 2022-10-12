import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config() 

const generatorJWT = (data, expiresIn) =>
  new Promise((resolve, reject) =>
    jwt.sign(data, process.env.JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    })
  );

export default generatorJWT;
