import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import serverRouter from "./routes/server.js";
import userRouter from "./routes/user.js";
import errorHandler from "./errorHandler.js";

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
server.use(errorHandler);

mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to DB!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is listening at port ${port}`);
  });
});

mongoose.connection.on("error", (error) => console.log(error));
