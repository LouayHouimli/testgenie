import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const tasks = sqliteTable("tasks", {
	id: text("id").primaryKey(),
	user_id: text("userId")
		.references(() => user.id)
		.notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	due_time: integer("due_time", { mode: "timestamp" }),
	completed: integer("completed", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
