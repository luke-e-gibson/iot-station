import { APIResponse } from "../api/API"

export class AuthService {

    constructor() {

    }

    public async login(username: string, password: string): Promise<APIResponse<{ userId: string }>> {
        return {
            errorMessage: null,
            httpCode: null,
            data: { userId: "___userId___" }
        }
    }

    public async register(username: string, password: string): Promise<APIResponse<{ userId: string }>> {
        // Implement registration logic here
        return {
            errorMessage: null,
            httpCode: null,
            data: { userId: "___userId___" }
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