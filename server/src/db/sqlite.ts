import { DatabaseSync } from "node:sqlite"
import { Database, DatabaseConfig, WeatherTable } from "./db"
 
export class DatabaseImplSqlite implements Database {
    private db: DatabaseSync;
    public weather: WeatherTable;

    constructor(config: DatabaseConfig) {
        this.db = new DatabaseSync(config.config.filename);
        this.weather = new WeatherTableImplSqlite(this.db);

        this.weather.updateSchema();
    }

    public updateSchema(): void {
        this.weather.updateSchema();
    }
}

export class WeatherTableImplSqlite implements WeatherTable {
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
        const record = this.database.prepare('INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)')
        record.run(temperature, humidity)
    }

    getWeatherRecords(): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        const statement = this.database.prepare('SELECT * FROM weather_data ORDER BY timestamp DESC')
        return statement.all() as Array<{ id: number; temperature: number; humidity: number; timestamp: string; }>
    }
    
    getWeatherRecordsInTimeRange(start: string, end: string): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        const statement = this.database.prepare('SELECT * FROM weather_data WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC')
        return statement.all(start, end) as Array<{ id: number; temperature: number; humidity: number; timestamp: string; }>
    }
    
    getLatestNWeatherRecords(n: number): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        const statement = this.database.prepare('SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT ?')
        return statement.all(n) as Array<{ id: number; temperature: number; humidity: number; timestamp: string; }>
    }

}