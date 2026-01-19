import { Router } from "express";
import { ServerContext } from "../context";
import { DeviceService } from "../services/Device";
import z from "zod";

const device = ServerContext.getInstance().GetService(DeviceService);
const router = Router();

const createDeviceSchema = z.object({
    authToken: z.string().min(1),
    name: z.string().min(1),
})

const deviceUploadDataSchema = z.object({
    deviceToken: z.string().min(1),
    deviceId: z.string().min(1),
    data: z.record(z.string(), z.any()),
});

const getDeviceDataSchema = z.object({
    authToken: z.string().min(1),
    deviceId: z.string().min(1),
});

router.get("/", (req, res) => {
    res.status(201).json({
        message: "Device API",
    });
})

router.post("/create", async (req, res) => {
    const parseResult = createDeviceSchema.safeParse(req.body);
    if(!parseResult.success) {
        return res.status(400).json({
            error: "Invalid request data",
            details: parseResult.error.issues,
        });
    }

    const response = await device.createDevice(
        parseResult.data.authToken,
        parseResult.data.name
    );

    return res.status(response.httpCode || 200).json(response);
})

router.post("/list", async (req, res) => {
    const authToken = req.body.authToken;
    if(!authToken || typeof authToken !== "string") {
        return res.status(400).json({
            error: "Invalid request data",
        });
    }
    const response = await device.listDevices(authToken);
    return res.status(response.httpCode || 200).json(response);
});

router.post("/data/submit", async (req, res) => {
    const parseResult = deviceUploadDataSchema.safeParse(req.body);
    if(!parseResult.success) {
        return res.status(400).json({
            error: "Invalid request data",
            details: parseResult.error.issues,
        });
    }

    const response = await device.submitDeviceData(
        parseResult.data.deviceToken,
        parseResult.data.deviceId,
        parseResult.data.data
    );
    return res.status(response.httpCode || 200).json(response);
});

router.post("/data/get", async (req, res) => {
    const parseResult = getDeviceDataSchema.safeParse(req.body);
    if(!parseResult.success) {
        return res.status(400).json({
            error: "Invalid request data",
            details: parseResult.error.issues,
        });
    }

    const response = await device.getDeviceData(
        parseResult.data.authToken,
        parseResult.data.deviceId
    );
    return res.status(response.httpCode || 200).json(response);
});

export default router;