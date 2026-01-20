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
    user_id: integer("user_id").notNull(),
})

export const devicesTable = pgTable("devices", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer("user_id").notNull(),
    device_id: varchar("device_id", { length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
})

export const deviceDataTable = pgTable("device_data", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    device_id: integer("device_id").notNull(),
    data: jsonb().notNull(),
})