import { DatabaseConfig } from "./db/db";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LoggerConfig {
    output: Array<'console' | 'file'>,
    file?: Array<"console" | "file">,
}

interface DatabaseConfigRaw {
    type: 'sqlite',
    location: string
}

export class Config {
    private databaseConfig: DatabaseConfig = { type: "sqlite", config: { filename: ":memory:" } };
    private loggerConfig: LoggerConfig = { output: ["console"] };
    
    constructor() {

    }

    private _readConfigFile(): any {
        try {
            const configPath = path.join(__dirname, '../config.json');
            const configData = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(configData);
        } catch (error) {
            console.error("Error reading config file:", error);
            throw new Error("Failed to read configuration.");
        }
    }

    public loadConfig() {
        const configData = this._readConfigFile();
        const rawDbConfig: DatabaseConfigRaw = configData.database;
        this.databaseConfig = {
            type: rawDbConfig.type,
            config: {
                filename: rawDbConfig.location
            }
        };
        this.loggerConfig = configData.logger;
    }

    public getDatabaseConfig(): DatabaseConfig {
        if (!this.databaseConfig) {
            throw new Error("Database configuration not loaded.");
        }
        return this.databaseConfig;
    }

    public getLoggerConfig(): LoggerConfig {
        if (!this.loggerConfig) {
            throw new Error("Logger configuration not loaded.");
        }
        return this.loggerConfig;
    }
}