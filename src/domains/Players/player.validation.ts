import { z } from "zod";

export const updatePlayerProfileSchema = z.object({
    age: z.number().optional(),
  
    position: z.string().optional(),
  
    location: z.string().optional(),
  
    currentClub: z.string().optional(),
  
    currentTeam: z.string().optional(),
  
    careerToal: z.string().optional(),
  
    keySkills: z.array(z.string()).optional(),
  
    achievements: z.string().optional(),
  });