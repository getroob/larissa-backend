import { Router } from "express";

const serverRouter = Router();
serverRouter.get("/", async (req, res, next) => res.send("Server is running!"));
export default serverRouter;
