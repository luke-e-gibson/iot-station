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

router.get("/devices/:device/weather/range", (req: express.Request, res: express.Response) => {
    const device = req.params.device;
    const start = req.query.start as string
    const end = req.query.end as string
    
    if (!device) {
        return res.status(400).json({ error: "Device parameter is required" })
    }
    
    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end parameters are required' })
    }
    
    const records = database.weather.getWeatherRecordsFromDeviceInTimeRange(device as string, start, end);
    res.json(records)
})

export default router