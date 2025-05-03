import { pgTable, text, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core";
import { users } from "./user-schema";

export const marketingTemplates = pgTable("marketing_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  variables: jsonb("variables").$type<string[]>(),
  createdBy: uuid("created_by").references(() => users.id),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertMarketingTemplate = typeof marketingTemplates.$inferInsert;
export type SelectMarketingTemplate = typeof marketingTemplates.$inferSelect; 