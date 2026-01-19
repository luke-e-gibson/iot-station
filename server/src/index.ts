import express from 'express';
import { ServerContext } from './context';

import { createClientRouter } from './client/index';

import authApi from './api/Auth';
import deviceApi from './api/Device';

const context = ServerContext.getInstance();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes first (before SSR catch-all)
app.use("/api/auth", authApi);
app.use("/api/device", deviceApi);

// Setup and mount the client SSR router
const clientRouter = await createClientRouter();
app.use("/", clientRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});