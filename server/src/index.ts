import express from 'express';
import { ServerContext } from './context';

import authApi from './api/Auth';
import deviceApi from './api/Device';

const context = ServerContext.getInstance();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authApi);
app.use("/api/device", deviceApi);

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});