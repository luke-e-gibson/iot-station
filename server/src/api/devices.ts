import express, { Router } from "express";
import { Instance } from "../Instance";

const router = Router()
const database = Instance.getInstance().getDatabase();

router.get("/devices/get", (req: express.Request, res: express.Response) => {
    const devices = database.weather.getDevices();
    res.json({ devices })
})

export default router