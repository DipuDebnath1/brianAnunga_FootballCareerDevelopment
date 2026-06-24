import { z } from "zod";

export const updateClubProfileSchema = z.object({
    about: z.string().optional(),
  
    cludeName: z.string().optional(),
  
    location: z.string().optional(),
  
    clubeOverview: z.string().optional(),
  });