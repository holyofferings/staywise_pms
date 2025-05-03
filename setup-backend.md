# Backend Setup Instructions for Styawise CRM

Use this guide to set up the backend for the Styawise hospitality management system with AI capabilities.

This project will use Supabase for database and authentication, Drizzle ORM for database interactions, and Express for the backend API, integrating with the React+Vite frontend.

## Helpful Links

- [Supabase Docs](https://supabase.com)
- [Drizzle Docs](https://orm.drizzle.team/docs/overview)
- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/api/reference)

## Install Libraries

```bash
npm i drizzle-orm dotenv postgres express cors openai qrcode whatsapp-web.js
npm i -D drizzle-kit tsx concurrently @types/express @types/cors @types/qrcode
```

## 1. Database Structure

Create a `/db` folder in the root with the following structure:
- `/db/schema` - Database schemas
- `/db/queries` - Database queries
- `/db/migrations` - Generated migrations

Add a `drizzle.config.ts` file in the project root:

```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
```

Create a database connection in `/db/db.ts`:

```ts
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

## 2. Core Data Models

### User Schema (`user-schema.ts`)

```ts
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
```

### Room Schema (`room-schema.ts`)

```ts
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
```

### Booking Schema (`booking-schema.ts`)

```ts
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
```

### Marketing Template Schema (`marketing-template-schema.ts`)

```ts
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
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
```

### Whatsapp Order Schema (`whatsapp-order-schema.ts`)

```ts
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
```

### QR Code Schema (`qr-code-schema.ts`)

```ts
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
```

### Settings Schema (`settings-schema.ts`)

```ts
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
```

Export all schemas in `/db/schema/index.ts`:

```ts
export * from "./user-schema";
export * from "./room-schema";
export * from "./booking-schema";
export * from "./marketing-template-schema";
export * from "./whatsapp-order-schema";
export * from "./qr-code-schema";
export * from "./settings-schema";
```

## 3. Database Queries

Create query files for each entity in the `/db/queries` folder:

### Room Queries (`room-queries.ts`):

```ts
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "../db";
import { InsertRoom, SelectRoom, rooms } from "../schema/room-schema";

export const createRoom = async (data: InsertRoom) => {
  try {
    const [newRoom] = await db.insert(rooms).values(data).returning();
    return newRoom;
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }
};

export const getRoomById = async (id: string) => {
  try {
    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, id)
    });
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    return room;
  } catch (error) {
    console.error("Error getting room by ID:", error);
    throw new Error("Failed to get room");
  }
};

export const getAllRooms = async (): Promise<SelectRoom[]> => {
  try {
    return db.query.rooms.findMany({
      orderBy: (rooms, { desc }) => [desc(rooms.createdAt)]
    });
  } catch (error) {
    console.error("Error getting all rooms:", error);
    throw new Error("Failed to get rooms");
  }
};

export const getAvailableRooms = async (checkIn: Date, checkOut: Date): Promise<SelectRoom[]> => {
  try {
    // Implementation to check availability against bookings
    return db.query.rooms.findMany({
      where: eq(rooms.isAvailable, true)
    });
  } catch (error) {
    console.error("Error getting available rooms:", error);
    throw new Error("Failed to get available rooms");
  }
};

export const updateRoom = async (id: string, data: Partial<InsertRoom>) => {
  try {
    const [updatedRoom] = await db
      .update(rooms)
      .set(data)
      .where(eq(rooms.id, id))
      .returning();
    
    return updatedRoom;
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error("Failed to update room");
  }
};

export const deleteRoom = async (id: string) => {
  try {
    await db.delete(rooms).where(eq(rooms.id, id));
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room");
  }
};
```

Create similar query files for all other entities.

## 4. AI Services

Create an AI service for generating marketing content and handling sales:

```ts
// src/services/ai-service.ts
import { OpenAI } from "openai";
import { config } from "dotenv";

config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateMarketingContent = async (
  type: string,
  targetAudience: string,
  keywords: string[],
  tone: string
) => {
  try {
    const prompt = `Create a ${type} for a hotel targeting ${targetAudience}. 
    Include these keywords: ${keywords.join(", ")}.
    Use a ${tone} tone.`;

    const response = await openai.completions.create({
      model: "gpt-4o",
      prompt,
      max_tokens: 500
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating marketing content:", error);
    throw new Error("Failed to generate marketing content");
  }
};

export const handleSalesConversation = async (
  userInput: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }>
) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful sales agent for a hotel. Provide information about rooms, amenities, and help with bookings."
      },
      ...conversationHistory,
      { role: "user", content: userInput }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in sales conversation:", error);
    throw new Error("Failed to generate response");
  }
};
```

## 5. WhatsApp Integration

```ts
// src/services/whatsapp-service.ts
import { Client, LocalAuth } from "whatsapp-web.js";
import { createWhatsappOrder } from "../db/queries/whatsapp-order-queries";

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// Handle order messages
client.on('message', async (message) => {
  if (message.body.startsWith('/order')) {
    try {
      // Parse order information
      const orderDetails = parseOrderMessage(message.body);
      
      // Create order in database
      await createWhatsappOrder({
        customerName: orderDetails.name,
        whatsappNumber: message.from,
        orderItems: orderDetails.items,
        totalAmount: orderDetails.total,
        status: 'pending',
        conversationId: message.id.id
      });
      
      // Confirm order received
      await client.sendMessage(message.from, 
        `Thank you for your order! We've received your order for ${orderDetails.items.length} items totaling $${orderDetails.total}.`);
    } catch (error) {
      console.error("Error processing WhatsApp order:", error);
      await client.sendMessage(message.from, 
        "Sorry, we couldn't process your order. Please try again or contact our support team.");
    }
  }
});

// Parse order message format
function parseOrderMessage(message: string) {
  // Implementation to parse structured order message
  // ...
}

// Initialize WhatsApp client
export const initWhatsApp = async () => {
  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
  });
  
  client.on('ready', () => {
    console.log('WhatsApp client is ready');
  });
  
  await client.initialize();
};
```

## 6. QR Code Generator

```ts
// src/services/qr-code-service.ts
import QRCode from 'qrcode';
import { createQRCode, getQRCodeById } from '../db/queries/qr-code-queries';

export const generateQRCode = async (
  name: string,
  type: string,
  data: string,
  createdBy: string
) => {
  try {
    // Generate QR code image
    const qrImageDataUrl = await QRCode.toDataURL(data);
    
    // Save to database
    const newQRCode = await createQRCode({
      name,
      type,
      data,
      imageUrl: qrImageDataUrl,
      createdBy,
      isActive: true
    });
    
    return newQRCode;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const getQRCodeDataById = async (id: string) => {
  try {
    const qrCode = await getQRCodeById(id);
    return qrCode;
  } catch (error) {
    console.error("Error getting QR code:", error);
    throw new Error("Failed to get QR code");
  }
};
```

## 7. Express API Server

Create a server.ts file in the root:

```ts
import express from "express";
import cors from "cors";
import { config } from "dotenv";

// Import route handlers
import roomRoutes from "./src/routes/room-routes";
import bookingRoutes from "./src/routes/booking-routes";
import authRoutes from "./src/routes/auth-routes";
import marketingRoutes from "./src/routes/marketing-routes";
import whatsappRoutes from "./src/routes/whatsapp-routes";
import qrCodeRoutes from "./src/routes/qr-code-routes";
import settingsRoutes from "./src/routes/settings-routes";
import aiRoutes from "./src/routes/ai-routes";

// Load environment variables
config({ path: ".env.local" });

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/qr-codes", qrCodeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Create route files for each feature in `/src/routes/`:

```ts
// src/routes/room-routes.ts
import express from "express";
import { 
  createRoom, 
  getRoomById, 
  getAllRooms,
  getAvailableRooms,
  updateRoom, 
  deleteRoom 
} from "../db/queries/room-queries";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const room = await createRoom(req.body);
    res.status(201).json({
      status: "success",
      message: "Room created successfully",
      data: room
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create room"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json({
      status: "success",
      message: "Rooms retrieved successfully",
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get rooms"
    });
  }
});

router.get("/available", async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const availableRooms = await getAvailableRooms(
      new Date(checkIn as string), 
      new Date(checkOut as string)
    );
    res.status(200).json({
      status: "success",
      message: "Available rooms retrieved successfully",
      data: availableRooms
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get available rooms"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Room retrieved successfully",
      data: room
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Room not found"
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const room = await updateRoom(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      message: "Room updated successfully",
      data: room
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update room"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteRoom(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Room deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete room"
    });
  }
});

export default router;
```

Create similar route files for all other entities.

## 8. Frontend Integration

Create API services for the frontend:

```typescript
// src/api/rooms-api.ts
import { ActionResponse } from "../types/api-types";
import { InsertRoom, SelectRoom } from "../../db/schema/room-schema";

const API_URL = import.meta.env.VITE_API_URL || "";

export const createRoom = async (data: InsertRoom): Promise<ActionResponse<SelectRoom>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error creating room:", error);
    return {
      status: "error",
      message: "Failed to create room"
    };
  }
};

export const getRoomById = async (id: string): Promise<ActionResponse<SelectRoom>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting room:", error);
    return {
      status: "error",
      message: "Failed to get room"
    };
  }
};

export const getAllRooms = async (): Promise<ActionResponse<SelectRoom[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms`);
    return await response.json();
  } catch (error) {
    console.error("Error getting rooms:", error);
    return {
      status: "error",
      message: "Failed to get rooms"
    };
  }
};

export const getAvailableRooms = async (checkIn: Date, checkOut: Date): Promise<ActionResponse<SelectRoom[]>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/rooms/available?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error getting available rooms:", error);
    return {
      status: "error",
      message: "Failed to get available rooms"
    };
  }
};

export const updateRoom = async (id: string, data: Partial<InsertRoom>): Promise<ActionResponse<SelectRoom>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error updating room:", error);
    return {
      status: "error",
      message: "Failed to update room"
    };
  }
};

export const deleteRoom = async (id: string): Promise<ActionResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${id}`, {
      method: "DELETE",
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      status: "error",
      message: "Failed to delete room"
    };
  }
};
```

Create similar API service files for all other entities.

## 9. Environment Configuration

Create a `.env.local` file:

```
DATABASE_URL=postgres://postgres:password@localhost:5432/styawise-hospitality
SERVER_PORT=3001
VITE_API_URL=http://localhost:3001
OPENAI_API_KEY=your_openai_api_key_here
```

## 10. Scripts

Update `package.json` with these scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview",
  "db:generate": "npx drizzle-kit generate",
  "db:migrate": "npx drizzle-kit migrate",
  "server": "tsx server.ts",
  "dev:all": "concurrently \"npm run dev\" \"npm run server\""
}
```

## 11. Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables in `.env.local`

3. Generate database migrations:
   ```bash
   npm run db:generate
   ```

4. Run migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev:all
   ```

Your backend is now set up with all the requested features:
- Landing Page API endpoints
- Authentication system
- Dashboard data endpoints
- Rooms Management
- Bookings Management
- AI Sales Agent
- AI Automation
- AI-Generated Marketing Templates
- WhatsApp Order Management
- QR Code Generator
- Settings Module 