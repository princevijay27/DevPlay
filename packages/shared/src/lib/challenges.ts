import { z } from "zod";

export const challengeSolutionMetaSchema = z.object({
  expectedAnswers: z.array(z.string()).min(1),
  alternateAnswers: z.array(z.string()).default([]),
  explanation: z.string().optional()
});

export type ChallengeSolutionMeta = z.infer<typeof challengeSolutionMetaSchema>;
