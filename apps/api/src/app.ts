import "dotenv/config";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import requestContext from "@fastify/request-context";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from "fastify-type-provider-zod";
import { nanoid } from "nanoid";

import { registerAuth } from "./plugins/auth.js";
import { registerClerkWebhookRoute } from "./routes/webhooks/clerk.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerMeRoute } from "./routes/me.js";
import { registerVoiceTranscribeRoute } from "./routes/voice/transcribe.js";

export async function buildServer() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty"
            }
          : undefined
    }
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(requestContext);
  await app.register(cors, {
    origin: true,
    credentials: true
  });
  await app.register(helmet);
  await app.register(multipart);

  app.addHook("onRequest", async (request, reply) => {
    const requestId = nanoid();
    request.requestContext.set("requestId", requestId);
    reply.header("x-request-id", requestId);
  });

  app.addHook("onResponse", async (request, reply) => {
    const requestId = request.requestContext.get("requestId");
    request.log.info(
      {
        requestId,
        statusCode: reply.statusCode,
        method: request.method,
        url: request.url
      },
      "Request completed"
    );
  });

  await registerAuth(app);
  await registerHealthRoute(app);
  await registerMeRoute(app);
  await registerVoiceTranscribeRoute(app);
  await registerClerkWebhookRoute(app);

  return app;
}
