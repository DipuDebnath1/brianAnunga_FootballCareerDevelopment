import { z } from "zod";

export const updateCoachProfileSchema = z.object({
  about: z.string().optional(),

  location: z.string().optional(),

  consultationFee: z.number().optional(),

  videoReviewFee: z.number().optional(),

  areaOfExpertise: z.array(z.string()).optional(),

  coachExperiences: z.string().optional(),

  coachingPhilosophy: z.string().optional(),

  service: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});