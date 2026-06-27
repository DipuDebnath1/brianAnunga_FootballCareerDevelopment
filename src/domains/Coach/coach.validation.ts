import { z } from "zod";
import { daysOfWeek } from "./coach.interface";

const dayEnum = z.enum(daysOfWeek);

const timeSlotBodySchema = z
  .object({
    day: dayEnum,
    startTime: z.coerce.date({ message: "startTime is required" }),
    endTime: z.coerce.date({ message: "endTime is required" }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

const updateTimeSlotBodySchema = z
  .object({
    day: dayEnum.optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "endTime must be after startTime",
      path: ["endTime"],
    }
  );

export const createTimeSlotValidation = z.object({
  body: timeSlotBodySchema,
});

export const updateTimeSlotValidation = z.object({
  body: updateTimeSlotBodySchema,
  params: z.object({
    slotId: z.string().min(1, "Time slot id is required"),
  }),
});

export const timeSlotIdParamValidation = z.object({
  params: z.object({
    slotId: z.string().min(1, "Time slot id is required"),
  }),
});

export const getTimeSlotsQueryValidation = z.object({
  query: z.object({
    day: dayEnum.optional(),
  }),
});

export type CreateTimeSlotInput = z.infer<typeof createTimeSlotValidation>["body"];
export type UpdateTimeSlotInput = z.infer<typeof updateTimeSlotValidation>["body"];

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

const CoachValidation = {
  createTimeSlotValidation,
  updateTimeSlotValidation,
  timeSlotIdParamValidation,
  getTimeSlotsQueryValidation,
  updateCoachProfileSchema,
};

export default CoachValidation;
