import { DatabaseSync } from "node:sqlite"

export interface DatabaseTable {
    updateSchema(): void;
}

export interface WeatherTable extends DatabaseTable {
    addWeatherRecord(temperature: number, humidity: number, device: string): void,
    getWeatherRecords(): Array<{ id: number, temperature: number, humidity: number, timestamp: string, device: string }>
    getWeatherRecordsInTimeRange(start: string, end: string): Array<{ id: number, temperature: number, humidity: number, timestamp: string, device: string }>
    getLatestNWeatherRecords(n: number): Array<{ id: number, temperature: number, humidity: number, timestamp: string, device: string }>

    getLatestNWeatherRecordsFromDevice(n: number, device: string): Array<{ id: number, temperature: number, humidity: number, timestamp: string, device: string }>
    getWeatherRecordsFromDevice(device: string): Array<{ id: number, temperature: number, humidity: number, timestamp: string, device: string }>
    getWeatherRecordsFromDeviceInTimeRange(device: string, start: string, end: string): Array<{ id: number, temperature: number, humidity: number, timestamp: string, device: string }>

    getDevices(): string[];

    _debug_create_test_data(): void;
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