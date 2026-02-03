import { createDatabase } from "./db";
import { Database } from "./db/db";

export class Instance {
    private static instance: Instance;

    private database?: Database;

    constructor() {
        if (Instance.instance) {
            throw new Error("Instance already exists. Use Instance.getInstance() to access it.");
        }

        this.database = createDatabase({ type: "sqlite", config: { filename: "weather_data.db" } });
    }

    public static getInstance(): Instance {
        if (!Instance.instance) {
            Instance.instance = new Instance();
        }
        return Instance.instance;
    }
    
    public getDatabase(): Database {
        if(!this.database) {
            throw new Error("Database not initialized.");
        }

        return this.database;
    }
    
}