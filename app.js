import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import * as dotenv from 'dotenv'
dotenv.config() 

import serverRouter from "./src/routes/server.js";
import userRouter from "./src/routes/user.js";
import errorHandler from "./src/errorHandler.js";
import sequelize, { testDB } from "./src/db/index.js";
import formRouter from "./src/routes/form.js";
import appointmentRouter from "./src/routes/appointment.js";
import User from "./src/db/models/user.js";
import encryptPassword from "./src/tools/encryptPassword.js";

const server = express();
server.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);
server.use(cookieParser());
server.use(express.json());
const port = process.env.PORT || 8080;

server.use("/", serverRouter);
server.use("/users", userRouter);
server.use("/forms", formRouter);
server.use("/appointments", appointmentRouter);
server.use(errorHandler);

server.listen(port, async () => {
  console.log(`✅ Server is running at port ${port}`);
  await testDB();
  await sequelize.sync({ alert: true });
  console.table(listEndpoints(server));
  // await User.create({
  //   firstName: "Larissa",
  //   lastName: "Municipality",
  //   email: "municipality@larissa.gr",
  //   password: await encryptPassword("Larissa1"),
  //   refreshToken: null,
  //   role: "municipality",
  // });
  // await User.create({
  //   firstName: "Refugee",
  //   lastName: "Municipality",
  //   email: "refugee@larissa.gr",
  //   password: await encryptPassword("Larissa1"),
  //   refreshToken: null,
  //   role: "refugee",
  // });
});

server.on("error", (error) => console.log("❌ Server is not running ", error));
