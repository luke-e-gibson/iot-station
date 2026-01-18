import { integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
});

export const deviceTokensTable = pgTable("device_tokens", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    token: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    userId: integer().notNull(),
})

export const devicesTable = pgTable("devices", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    deviceId: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
})

export const deviceDataTable = pgTable("device_data", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    deviceId: integer().notNull(),
    data: jsonb().notNull(),
})