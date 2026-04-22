import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, users } from "@devflow/db";
import type { FastifyInstance } from "fastify";

export async function registerMeRoute(app: FastifyInstance) {
  app.get(
    "/api/me",
    {
      schema: {
        response: {
          200: z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string().nullable(),
            timezone: z.string()
          }),
          401: z.object({
            message: z.string()
          }),
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      if (!request.auth.userId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, request.auth.userId)
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone
      };
    }
  );
}
