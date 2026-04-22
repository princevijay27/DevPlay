import fp from "fastify-plugin";
import { verifyToken } from "@clerk/backend";
import type { FastifyRequest } from "fastify";
import { z } from "zod";

const authEnvSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1)
});

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      userId: string | null;
      token: string | null;
    };
  }

  interface FastifyInstance {
    requireAuth: (request: FastifyRequest) => Promise<void>;
  }
}

export const registerAuth = fp(async (app) => {
  const env = authEnvSchema.parse(process.env);

  app.decorate("requireAuth", async (request) => {
    if (!request.auth.userId) {
      const error = new Error("Unauthorized") as Error & { statusCode?: number };
      error.statusCode = 401;
      throw error;
    }
  });

  app.addHook("onRequest", async (request) => {
    request.auth = { userId: null, token: null };
  });

  app.addHook("preHandler", async (request) => {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      request.auth = { userId: null, token: null };
      return;
    }

    const token = header.slice("Bearer ".length);

    try {
      const payload = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY
      });

      request.auth = {
        userId: payload.sub ?? null,
        token
      };
    } catch {
      request.auth = { userId: null, token: null };
    }
  });
});
