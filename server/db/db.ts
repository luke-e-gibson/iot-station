import { DatabaseSync } from "node:sqlite"

const database = new DatabaseSync(":memory:")
database.exec(`
CREATE TABLE IF NOT EXISTS weather_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

export interface DatabaseTable {
    updateSchema(): void;
}

export interface WeatherTable extends DatabaseTable {
    addWeatherRecord(temperature: number, humidity: number): void,
    getWeatherRecords(): Array<{ id: number, temperature: number, humidity: number, timestamp: string }>
    getWeatherRecordsInTimeRange(start: string, end: string): Array<{ id: number, temperature: number, humidity: number, timestamp: string }>
    getLatestNWeatherRecords(n: number): Array<{ id: number, temperature: number, humidity: number, timestamp: string }>
}

export interface Database {
    weather: WeatherTable
}


export default database