import { DatabaseSync } from "node:sqlite"

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

type DatabaseConfigSqlite = {
    filename: string
}
export interface DatabaseConfig {
    type: 'sqlite',
    config: DatabaseConfigSqlite
}