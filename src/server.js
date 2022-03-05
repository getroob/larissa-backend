import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import serverRouter from "./routes/server.js";
import userRouter from "./routes/user.js";
import errorHandler from "./errorHandler.js";
import sequelize, { testDB } from "./db/index.js";

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

server.listen(port, async () => {
  console.log(`✅ Server is running at port ${port}`);
  await testDB();
  await sequelize.sync({ alert: true });
  console.table(listEndpoints(server));
});

server.on("error", (error) => console.log("❌ Server is not running ", error));

// mongoose.connect(process.env.DB_URL);

// mongoose.connection.on("connected", () => {
//   console.log("Connected to DB!");

//   server.listen(port, () => {
//     console.table(listEndpoints(server));
//     console.log(`Server is listening at port ${port}`);
//   });
// });

// mongoose.connection.on("error", (error) => console.log(error));
