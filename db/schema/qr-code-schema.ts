import { pgTable, text, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core";
import { users } from "./user-schema";

export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  data: text("data").notNull(),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata"),
  createdBy: uuid("created_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertQRCode = typeof qrCodes.$inferInsert;
export type SelectQRCode = typeof qrCodes.$inferSelect; 