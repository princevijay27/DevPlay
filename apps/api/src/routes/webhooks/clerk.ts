import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import { z } from "zod";

import { db, users } from "@devflow/db";
import type { FastifyInstance } from "fastify";

const clerkUserSchema = z.object({
  id: z.string(),
  email_addresses: z.array(
    z.object({
      email_address: z.string().email()
    })
  ),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional()
});

function getHeaders(headers: Record<string, unknown>) {
  return {
    "svix-id": String(headers["svix-id"] ?? ""),
    "svix-timestamp": String(headers["svix-timestamp"] ?? ""),
    "svix-signature": String(headers["svix-signature"] ?? "")
  };
}

export async function registerClerkWebhookRoute(app: FastifyInstance) {
  app.post("/api/webhooks/clerk", async (request, reply) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      return reply.status(500).send({ message: "Missing webhook secret" });
    }

    const payload = JSON.stringify(request.body ?? {});
    const wh = new Webhook(secret);

    let event: { type: string; data: unknown };

    try {
      event = wh.verify(payload, getHeaders(request.headers as Record<string, unknown>)) as {
        type: string;
        data: unknown;
      };
    } catch {
      return reply.status(400).send({ message: "Invalid webhook signature" });
    }

    if (event.type === "user.deleted") {
      const deletedUser = z.object({ id: z.string() }).parse(event.data);
      await db.delete(users).where(eq(users.id, deletedUser.id));
      return reply.status(200).send({ ok: true });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const user = clerkUserSchema.parse(event.data);
      const primaryEmail = user.email_addresses[0]?.email_address;

      if (!primaryEmail) {
        return reply.status(400).send({ message: "Missing primary email" });
      }

      const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

      await db
        .insert(users)
        .values({
          id: user.id,
          email: primaryEmail,
          name,
          timezone: "UTC",
          preferredLanguages: []
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: primaryEmail,
            name,
            updatedAt: new Date()
          }
        });
    }

    return reply.status(200).send({ ok: true });
  });
}
