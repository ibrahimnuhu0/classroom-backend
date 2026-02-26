import { classes } from './db/schema/app';
import { index } from 'drizzle-orm/pg-core';
import AgentAPI from 'apminsight';
AgentAPI.config()

import express, { Request, Response } from 'express';
import cors from 'cors'


import subjectsRouter from "./routes/subjects.js"
import securityMiddleware from './middleware/security.js';
import {toNodeHandler} from  "better-auth/node";
import { auth } from './lib/auth.js';
import usersRouter from './routes/users.js';
import classesRouter from './routes/classes.js';

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) throw new Error ('FRONTEND_URL is not in .env file')

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))



app.use(express.json());

app.use(securityMiddleware)

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use('/api/subjects', subjectsRouter)
app.use('/api/users', usersRouter);
app.use('./api/classes', classesRouter)


// Root GET route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Hello from Express TypeScript server!',
    timestamp: new Date().toISOString()
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;