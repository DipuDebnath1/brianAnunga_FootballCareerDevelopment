import { z } from "zod";
import { PlayerConsultationStatus } from "./PlayerConsultation.interface";

const requestIdParam = z.object({
  requestId: z.string().min(1, "Request id is required"),
});

export const createConsultationValidation = z.object({
  body: z.object({
    coach: z.string().min(1, "Coach id is required"),
    consultationTopic: z.string().min(1, "Consultation topic is required"),
    bookingSlot: z.string().min(1, "Booking slot is required"),
    questions: z.string().min(1, "Questions are required"),
  }),
});

export const updateConsultationStatusValidation = z.object({
  body: z.object({
    status: z.enum([
      PlayerConsultationStatus.ACCEPT,
      PlayerConsultationStatus.DECLINE,
    ]),
  }),
  params: requestIdParam,
});

export const updateConsultationMeetingValidation = z.object({
  body: z
    .object({
      meetingLink: z.string().url("Meeting link must be a valid URL").optional(),
      bookingSlot: z.string().min(1, "Booking slot is required").optional(),
    })
    .refine((data) => data.meetingLink || data.bookingSlot, {
      message: "At least meetingLink or bookingSlot is required",
    }),
  params: requestIdParam,
});

export const completeConsultationValidation = z.object({
  body: z.object({
    coachFeedback: z.string().min(1, "Coach feedback is required"),
  }),
  params: requestIdParam,
});

export const addConsultationReviewValidation = z.object({
  body: z.object({
    value: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(1, "Review comment is required"),
  }),
  params: requestIdParam,
});

export const getConsultationsQueryValidation = z.object({
  query: z.object({
    status: z
      .enum(Object.values(PlayerConsultationStatus) as [string, ...string[]])
      .optional(),
  }),
});

export const requestIdParamValidation = z.object({
  params: requestIdParam,
});

export type CreateConsultationInput = z.infer<
  typeof createConsultationValidation
>["body"];
export type UpdateConsultationStatusInput = z.infer<
  typeof updateConsultationStatusValidation
>["body"];
export type UpdateConsultationMeetingInput = z.infer<
  typeof updateConsultationMeetingValidation
>["body"];
export type CompleteConsultationInput = z.infer<
  typeof completeConsultationValidation
>["body"];
export type AddConsultationReviewInput = z.infer<
  typeof addConsultationReviewValidation
>["body"];

const PlayerConsultationValidation = {
  createConsultationValidation,
  updateConsultationStatusValidation,
  updateConsultationMeetingValidation,
  completeConsultationValidation,
  addConsultationReviewValidation,
  getConsultationsQueryValidation,
  requestIdParamValidation,
};

export default PlayerConsultationValidation;
