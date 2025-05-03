import { pgTable, text, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertSetting = typeof settings.$inferInsert;
export type SelectSetting = typeof settings.$inferSelect; 