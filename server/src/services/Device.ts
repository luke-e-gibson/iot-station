import { eq } from "drizzle-orm";
import { APIResponse } from "../api/API";
import { db } from "../db";
import * as schema from "../db/schema";
import { ServerContext } from "../context";
import { AuthService } from "./Auth";

export class DeviceService {

    constructor() {

    }

    public async createDevice(userToken: string, name: string): Promise<APIResponse<{ deviceId: string }>> {
        const authService = ServerContext.getInstance().GetService(AuthService);
        const validatedUser = authService.validateToken(userToken);
        if(!validatedUser) {
            return {
                errorMessage: "Invalid user",
                httpCode: 401,
                data: null
            }
        }
        
        await db.select().from(schema.devicesTable).where(eq(schema.devicesTable.name, name)).limit(1).then(devices => {
            if(devices.length > 0) {
                return {
                    errorMessage: "Device name already exists",
                    httpCode: 400,
                    data: null
                }
            }
        });

        const deviceID = crypto.randomUUID();
        await db.insert(schema.devicesTable).values({
            userId: validatedUser.userId,
            name: name,
            deviceId: deviceID
        }).returning();

        return {
            errorMessage: null,
            httpCode: 201,
            data: { deviceId: deviceID }
        }
    }

    public async listDevices(authToken: string): Promise<APIResponse<{ devices: Array<{ id: number, name: string, deviceId: string }> }>> {
        const authService = ServerContext.getInstance().GetService(AuthService);
        const validatedUser = authService.validateToken(authToken);
        if(!validatedUser) {
            return {
                errorMessage: "Invalid user",
                httpCode: 401,
                data: null
            }
        }

        const devices = await db.select().from(schema.devicesTable).where(eq(schema.devicesTable.userId, validatedUser.userId));

        return {
            errorMessage: null,
            httpCode: 200,
            data: { devices: devices.map(device => ({ id: device.id, name: device.name, deviceId: device.deviceId })) }
        };
    }

    public async submitDeviceData(deviceToken: string, deviceId: string, data: Record<string, any>): Promise<APIResponse<{ saved: boolean }>> {
        const authService = ServerContext.getInstance().GetService(AuthService);
        const tokenValidation = await authService.verifyDeviceToken(deviceToken);

        if(tokenValidation.data?.valid !== true) {
            return {
                errorMessage: "Invalid device token",
                httpCode: 401,
                data: null
            }
        }

        const devices = await db.select().from(schema.devicesTable).where(eq(schema.devicesTable.deviceId, deviceId)).limit(1);
        if(devices.length === 0) {
            return {
                errorMessage: "Invalid device ID",
                httpCode: 400,
                data: null
            }
        }

        await db.insert(schema.deviceDataTable).values({
            deviceId: devices[0].id,
            data: data,
        }).returning();

        return {
            errorMessage: null,
            httpCode: 201,
            data: { saved: true}
        }
    }
}