import { APIResponse } from "../api/API"

export class AuthService {

    constructor() {

    }

    public login(username: string, password: string): APIResponse<{ userId: string }> {
        // Implement login logic heres
        return {
            errorMessage: null,
            httpCode: null,
            data: { userId: "___userId___" }
        }
    }

    public register(username: string, password: string): APIResponse<{ userId: string }> {
        // Implement registration logic here
        return {
            errorMessage: null,
            httpCode: null,
            data: { userId: "___userId___" }
        }
    }

    public createToken(userId: string): APIResponse<string> {
        // Implement token creation logic here
        return {
            errorMessage: null,
            httpCode: null,
            data: "___token___"
        }
    }

}