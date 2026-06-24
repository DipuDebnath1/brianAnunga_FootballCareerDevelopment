import { z } from "zod";

export const updateAgentProfileSchema = z.object({
    about: z.string().optional(),
  
    location: z.number().optional(),
  
    areaOfExpertise: z.array(z.string()).optional(),
  
    experiences: z.string().optional(),
  
    service: z
      .object({
        serviceName: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  });