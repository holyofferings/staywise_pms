import { pgTable, text, timestamp, uuid, doublePrecision, integer, boolean } from "drizzle-orm/pg-core";
import { rooms } from "./room-schema";
import { users } from "./user-schema";

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guestCount: integer("guest_count").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  specialRequests: text("special_requests"),
  source: text("source").default("direct"),
  isConfirmed: boolean("is_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect; 