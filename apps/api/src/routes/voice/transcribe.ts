import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { voiceTranscriptionResponseSchema } from "@devflow/shared";

const transcriptionUpstreamSchema = z.object({
  text: z.string()
});

export async function registerVoiceTranscribeRoute(app: FastifyInstance) {
  app.post(
    "/api/voice/transcribe",
    {
      schema: {
        response: {
          200: voiceTranscriptionResponseSchema,
          400: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
          503: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      if (!request.auth.userId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return reply.status(503).send({ message: "OPENAI_API_KEY is not configured" });
      }

      const file = await request.file();

      if (!file) {
        return reply.status(400).send({ message: "Missing audio upload" });
      }

      const bytes = await file.toBuffer();
      const mimeType = file.mimetype || "audio/webm";
      const model = process.env.OPENAI_TRANSCRIPTION_MODEL ?? "whisper-1";

      const formData = new FormData();
      formData.append("model", model);
      formData.append("file", new Blob([bytes], { type: mimeType }), file.filename || "voice.webm");

      const upstream = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: formData
      });

      if (!upstream.ok) {
        request.log.error(
          {
            requestId: request.requestContext.get("requestId"),
            status: upstream.status,
            userId: request.auth.userId
          },
          "Whisper transcription upstream call failed"
        );

        return reply.status(503).send({ message: "Transcription service unavailable" });
      }

      const payload = transcriptionUpstreamSchema.parse(await upstream.json());

      request.log.info(
        {
          requestId: request.requestContext.get("requestId"),
          userId: request.auth.userId,
          bytes: bytes.byteLength,
          mimeType,
          model
        },
        "Whisper transcription completed"
      );

      return {
        transcript: payload.text,
        engine: "whisper" as const
      };
    }
  );
}
