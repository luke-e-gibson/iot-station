import express, { Router } from "express";
import { Instance } from "../Instance";

const router = Router()
const database = Instance.getInstance().getDatabase();

router.get("/devices/get", (req: express.Request, res: express.Response) => {
    const devices = database.weather.getDevices();
    res.json({ devices })
})

router.get("/devices/:device/weather", (req: express.Request, res: express.Response) => {
    const device = req.params.device;
    if(!device) {
        res.status(400).json({ error: "Device parameter is required" })
        return;
    }
    const records = database.weather.getWeatherRecordsFromDevice(device as string);
    res.json(records)
})

router.get("/devices/:device/weather/latest", (req: express.Request, res: express.Response) => {
    const device = req.params.device;
    if(!device) {
        res.status(400).json({ error: "Device parameter is required" })
        return;
    }
    const count = parseInt(req.query.count as string) || 1;
    const records = database.weather.getLatestNWeatherRecordsFromDevice(count, device as string);
    res.json(records)
})

export default router