import { pgTable, text, timestamp, uuid, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { users } from "./user-schema";

export const whatsappOrders = pgTable("whatsapp_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  orderItems: jsonb("order_items").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  processedBy: uuid("processed_by").references(() => users.id),
  conversationId: text("conversation_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertWhatsappOrder = typeof whatsappOrders.$inferInsert;
export type SelectWhatsappOrder = typeof whatsappOrders.$inferSelect; 