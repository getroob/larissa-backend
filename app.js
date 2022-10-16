import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import express-github-webhook from 'express-github-webhook';
import listEndpoints from 'express-list-endpoints';

import serverRouter from './src/routes/server.js';
import userRouter from './src/routes/user.js';
import errorHandler from './src/errorHandler.js';
import sequelize, { testDB } from './src/db/index.js';
import formRouter from './src/routes/form.js';
import appointmentRouter from './src/routes/appointment.js';
import User from './src/db/models/user.js';
import encryptPassword from './src/tools/encryptPassword.js';
import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const webhookHandler = GithubWebHook({ path: '/api/webhook', secret: process.env.GITHUB_WEBHOOK_SECRET });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = express();

// Have Node serve the files for our built React app
server.use(express.static(path.resolve(__dirname, './client')));
server.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);
server.use(cookieParser());
server.use(express.json());
server.use(webhookHandler);
const port = process.env.PORT || 8080;

server.use('/api/status', serverRouter);
server.use('/api/users', userRouter);
server.use('/api/forms', formRouter);
server.use('/api/appointments', appointmentRouter);
server.use(errorHandler);

// All other GET requests not handled before will return our React app
server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client', 'index.html'));
});

webhookHandler.on('push', (repo, data) => {
  exec('git pull && touch tmp/restart.txt');
});

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

server.on('error', (error) => console.log('❌ Server is not running ', error));
