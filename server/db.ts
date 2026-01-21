import * as config from "./config.json"
import { DatabaseSync } from "node:sqlite"

const database = new DatabaseSync(config.database.location)
database.exec(`
CREATE TABLE IF NOT EXISTS weather_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

export default database