import { readFileSync } from "node:fs"
import { DatabaseSync } from "node:sqlite"

const config = JSON.parse(
    readFileSync(new URL("./config.json", import.meta.url), "utf-8")
) as { database?: { location?: string } }
const location = config.database?.location?.trim()

if (!location) {
    throw new Error("Missing database location in server/config.json")
}
const database = new DatabaseSync(location)
database.exec(`
CREATE TABLE IF NOT EXISTS weather_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

export default database