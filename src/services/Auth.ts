import { create } from "node:domain"
import { APIResponse } from "../api/API"
import { createHash } from "node:crypto"
import { db } from "../db/index"
import * as schema from "../db/schema"
import { eq } from "drizzle-orm"
import JWT from "jsonwebtoken"

export class AuthService {

    constructor() {

    }

    private async _userExists(username: string): Promise<boolean> {
        return await db.select().from(schema.usersTable).where(eq(schema.usersTable.username, username)).limit(1).then(users => users.length > 0);
    }

    public async login(username: string, password: string): Promise<APIResponse<{ token: string }>> {
        //User lookup
        const users = await db.select().from(schema.usersTable).where(eq(schema.usersTable.username, username)).limit(1);
        if(users.length === 0) {
            return {
                errorMessage: "Invalid username or password",
                httpCode: 401,
                data: null
            }
        }

        const passwordHash = createHash("sha256").update(password).digest("base64");
        if(users[0].password !== passwordHash) {
            return {
                errorMessage: "Invalid username or password",
                httpCode: 401,
                data: null
            }
        }

        const token = JWT.sign({ userId: users[0].id, username: users[0].username }, "temp", { expiresIn: '1h' });

        return {
            errorMessage: null,
            httpCode: 200,
            data: { 
                token: token
            }
        }
    }

    public async register(username: string, password: string): Promise<APIResponse<{ userId: string }>> {
        //Email check
        const existingUser = await db.select().from(schema.usersTable).where(eq(schema.usersTable.username, username)).limit(1);
        if(existingUser.length > 0) {
            return {
                errorMessage: "Username already exists",
                httpCode: 400,
                data: null
            }
        }
        
        const passwordHash = createHash("sha256").update(password).digest("base64");        
        const result = await db.insert(schema.usersTable).values({
            username: username,
            password: passwordHash,
        }).returning();

        return {
            errorMessage: null,
            httpCode: 201,
            data: { userId: result[0].id.toString()}
        }
    }

    public async createToken(authToken: string, name: string): Promise<APIResponse<{ deviceToken: string }>> {
        //Make sure token is valid
        const decoded = JWT.verify(authToken, "temp") as { userId: number, username: string };
        if(!decoded) {
            return {
                errorMessage: "Invalid auth token",
                httpCode: 401,
                data: null
            }
        }

        //Verify user exists
        const user = await db.select().from(schema.usersTable).where(eq(schema.usersTable.id, decoded.userId)).limit(1);
        if(user.length === 0) {
            return {
                errorMessage: "User does not exist",
                httpCode: 401,
                data: null
            }
        }

        //Create device token
        const deviceToken = createHash("sha256").update(decoded.userId + name + Date.now().toString()).digest("hex");
        await db.insert(schema.deviceTokensTable).values({
            name: name,
            token: deviceToken,
            userId: decoded.userId,
        }).returning();
        
        return {
            errorMessage: null,
            httpCode: 201,
            data: {
                deviceToken: deviceToken
            }
        }
    }


    public async verifyDeviceToken(deviceToken: string): Promise<APIResponse<{ valid: boolean }>> {
        const tokens = await db.select().from(schema.deviceTokensTable).where(eq(schema.deviceTokensTable.token, deviceToken)).limit(1);
        if(tokens.length === 0) {
            return {
                errorMessage: "Invalid device token",
                httpCode: 401,
                data: { valid: false }
            }
        }

        return {
            errorMessage: null,
            httpCode: 200,
            data: { valid: true }
        }
    }
}