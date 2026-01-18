import { create } from "node:domain"
import { APIResponse } from "../api/API"
import { createHash } from "node:crypto"
import { db } from "../db/index"
import * as schema from "../db/schema"
import { eq } from "drizzle-orm"

export class AuthService {

    constructor() {

    }

    public async login(username: string, password: string): Promise<APIResponse<{ userId: string }>> {
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
        
        return {
            errorMessage: null,
            httpCode: 200,
            data: { 
                userId: users[0].id.toString() 
                
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

    public async createToken(userId: string): Promise<APIResponse<string>> {
        // Implement token creation logic here
        return {
            errorMessage: null,
            httpCode: null,
            data: "___token___"
        }
    }

}