import { tasks } from "@server/db/schema/tasks";
import { protectedProcedure } from "@server/lib/trpc";
import { router } from "@server/lib/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

const taskSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(1000),
	due_time: z.string().min(1),
});
const deleteTasksSchema = z.object({
	id: z.string().min(1),
});
const updateTaskSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(1000),
	due_time: z.string().min(1),
});

export const tasksRouter = router({
	getTasks: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db
			.select()
			.from(tasks)
			.where(eq(tasks.user_id, ctx.session.userId));
	}),
	createTask: protectedProcedure
		.input(taskSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.db
					.insert(tasks)
					.values({
						...input,
						id: crypto.randomUUID(),
						user_id: ctx.session.userId,
						createdAt: new Date(),
						updatedAt: new Date(),
						completed: false,
						due_time: new Date(input.due_time),
					})
					.returning()
					.get();
			} catch (e) {
				console.error(e);
				throw new Error("Failed to create task");
			}
		}),
	deleteTasks: protectedProcedure
		.input(deleteTasksSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.db
					.delete(tasks)
					.where(eq(tasks.id, input.id))
					.returning()
					.get();
			} catch (e) {
				console.error(e);
				throw new Error("Failed to delete task");
			}
		}),
	updateTask: protectedProcedure
		.input(updateTaskSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.db
					.update(tasks)
					.set({
						...input,
						updatedAt: new Date(),

						due_time: new Date(input.due_time),
					})
					.where(eq(tasks.id, input.id))
					.returning()
					.get();
			} catch (e) {
				console.error(e);
				throw new Error("Failed to update task");
			}
		}),
});

export type Task = z.infer<typeof taskSchema>;
