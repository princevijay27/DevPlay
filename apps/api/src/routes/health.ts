import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@devflow/db";
import type { FastifyInstance } from "fastify";

export async function registerHealthRoute(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: z.object({
            status: z.literal("ok"),
            db: z.literal("ok")
          })
        }
      }
    },
    async () => {
      await db.execute(sql`select 1`);

      return {
        status: "ok" as const,
        db: "ok" as const
      };
    }
  );
}
