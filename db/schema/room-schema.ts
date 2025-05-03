import { pgTable, text, timestamp, uuid, integer, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  roomType: text("room_type").notNull(),
  capacity: integer("capacity").notNull(),
  price: doublePrecision("price").notNull(),
  discount: doublePrecision("discount").default(0),
  isAvailable: boolean("is_available").default(true).notNull(),
  amenities: jsonb("amenities").$type<string[]>(),
  images: jsonb("images").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertRoom = typeof rooms.$inferInsert;
export type SelectRoom = typeof rooms.$inferSelect; 