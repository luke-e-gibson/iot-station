import { DatabaseSync } from "node:sqlite"
import { Database, DatabaseConfig, WeatherTable } from "./db"
import { Logger } from "../Logger";
import { Instance } from "../Instance";
 
export class DatabaseImplSqlite implements Database {
    private _logger: Logger;
    private db: DatabaseSync;
    public weather: WeatherTable;



    constructor(config: DatabaseConfig) {
        this.db = new DatabaseSync(config.config.filename);
        this.weather = new WeatherTableImplSqlite(this.db);
        this._logger = Instance.getInstance().getLogger().createSublogger("Database");

        this.weather.updateSchema();
    }

    public updateSchema(): void {
        this.weather.updateSchema();
    }
}

export class WeatherTableImplSqlite implements WeatherTable {
    private _logger: Logger;

    constructor(private database: DatabaseSync) {
        this._logger = Instance.getInstance().getLogger().createSublogger("WeatherTable");
    }

    updateSchema(): void {
        this._logger.log("Updating weather_data table schema if necessary...");
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
        this._logger.log(`Adding weather record: temperature=${temperature}, humidity=${humidity}`);
        const record = this.database.prepare('INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)')
        record.run(temperature, humidity)
    }

    getWeatherRecords(): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        this._logger.log("Fetching all weather records...");
        const statement = this.database.prepare('SELECT * FROM weather_data ORDER BY timestamp DESC')
        return statement.all() as Array<{ id: number; temperature: number; humidity: number; timestamp: string; }>
    }
    
    getWeatherRecordsInTimeRange(start: string, end: string): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        this._logger.log(`Fetching weather records between ${start} and ${end}...`);
        const statement = this.database.prepare('SELECT * FROM weather_data WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC')
        return statement.all(start, end) as Array<{ id: number; temperature: number; humidity: number; timestamp: string; }>
    }
    
    getLatestNWeatherRecords(n: number): Array<{ id: number; temperature: number; humidity: number; timestamp: string; }> {
        this._logger.log(`Fetching latest ${n} weather records...`);
        const statement = this.database.prepare('SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT ?')
        return statement.all(n) as Array<{ id: number; temperature: number; humidity: number; timestamp: string; }>
    }

    _debug_create_test_data() {
        this._logger.log("Creating test data...");
        const insert = this.database.prepare('INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)')
        this.database.exec("BEGIN TRANSACTION");
        try {
            for (let i = 0; i < 1000; i++) {
                const temp = 20 + Math.random() * 10;
                const hum = 40 + Math.random() * 20;
                insert.run(temp, hum);
            }
            this.database.exec("COMMIT");
        } catch (error) {
            this._logger.log("Error creating test data, rolling back transaction.");
            try {
                this.database.exec("ROLLBACK");
            } catch {
                // Ignore rollback errors
            }
            throw error;
        }
    }

}