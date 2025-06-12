import { publicProcedure, router } from "../lib/trpc";
import { tasksRouter } from "./tasks/tasks";
import { userRouter } from "./user/user";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  helloFrom: publicProcedure.query(() => {
    return "Hello from TestGenie Api";
  }),
  jsonTest: publicProcedure.query(() => {
    return {
      message: "Hello, World!",
      data: {
        name: "John Doe",
        age: 30,
        email: "john.doe@testgenie.app",
      },
    };
  }),

  user: userRouter,
  tasks: tasksRouter,
});
export type AppRouter = typeof appRouter;
