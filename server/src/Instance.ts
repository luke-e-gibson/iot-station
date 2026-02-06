import { Config } from "./Config";
import { createDatabase } from "./db";
import { Database } from "./db/db";
import { Logger } from "./Logger";

export class Instance {
    private static instance: Instance;

    private database?: Database;
    private config: Config;
    private logger: Logger;

    constructor() {
        if (Instance.instance) {
            throw new Error("Instance already exists. Use Instance.getInstance() to access it.");
        }

        // Set the instance before creating the database to avoid circular dependency
        Instance.instance = this;
        this.config = new Config();
        this.config.loadConfig();
        
        this.logger = new Logger("Iot Station Server");
        this.database = createDatabase(this.config.getDatabaseConfig() ?? { type: "sqlite", config: { filename: ":memory:" } });
    }

    public static getInstance(): Instance {
        if (!Instance.instance) {
            Instance.instance = new Instance();
        }
        return Instance.instance;
    }

    public getLogger(): Logger {
        return this.logger;
    }
    
    public getDatabase(): Database {
        if(!this.database) {
            throw new Error("Database not initialized.");
        }

        return this.database;
    }
    
}