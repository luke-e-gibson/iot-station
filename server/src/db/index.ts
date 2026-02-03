import { DatabaseImplSqlite } from "./sqlite"
import { DatabaseConfig } from "./db"

export function createDatabase(config: DatabaseConfig) {
    if (config.type === "sqlite") {
        return new DatabaseImplSqlite(config)
    } else {
        throw new Error(`Unsupported database type: ${config.type}`)
    }
}