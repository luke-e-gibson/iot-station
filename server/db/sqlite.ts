import { DatabaseSync } from "node:sqlite"
import { Database, WeatherTable } from "./db"

class DatabaseImplSqlite implements Database {
    
}

class WeatherTableImplSqlite implements WeatherTable {
    constructor(private database: DatabaseSync) {}

    updateSchema(): void {
        this.database.exec(`
CREATE TABLE IF NOT EXISTS weather_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)
    }

    addWeatherRecord(temperature: number, humidity: number): void {
        throw new Error("Method not implemented.");
    }
    getWeatherRecords(): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        throw new Error("Method not implemented.");
    }
    getWeatherRecordsInTimeRange(start: string, end: string): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        throw new Error("Method not implemented.");
    }
    getLatestNWeatherRecords(n: number): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        throw new Error("Method not implemented.");
    }

}