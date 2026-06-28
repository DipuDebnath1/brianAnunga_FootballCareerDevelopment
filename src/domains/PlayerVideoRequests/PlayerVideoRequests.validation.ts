import { z } from "zod";
import { PlayerVideoRequestStatus } from "./PlayerVideoRequests.interface";

const requestIdParam = z.object({
  requestId: z.string().min(1, "Request id is required"),
});

const videoUrlSchema = z
  .string()
  .url("Video must be a valid URL")
  .refine((value) => value.startsWith("https://"), {
    message: "Video must be a valid HTTPS URL",
  });

export const createVideoRequestValidation = z.object({
  body: z.object({
    coach: z.string().min(1, "Coach id is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    video: videoUrlSchema,
    areaOfFocus: z.string().min(1, "Area of focus is required"),
  }),
});

export const updateRequestStatusValidation = z.object({
  body: z.object({
    status: z.enum([
      PlayerVideoRequestStatus.ACCEPT,
      PlayerVideoRequestStatus.DECLINE,
    ]),
  }),
  params: requestIdParam,
});

export const completeVideoRequestValidation = z.object({
  body: z.object({
    coachFeedback: z.string().min(1, "Coach feedback is required"),
  }),
  params: requestIdParam,
});

export const addVideoReviewValidation = z.object({
  body: z.object({
    value: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(1, "Review comment is required"),
  }),
  params: requestIdParam,
});

export const getVideoRequestsQueryValidation = z.object({
  query: z.object({
    status: z.enum(Object.values(PlayerVideoRequestStatus) as [string, ...string[]]).optional(),
  }),
});

export const requestIdParamValidation = z.object({
  params: requestIdParam,
});

export type CreateVideoRequestInput = z.infer<
  typeof createVideoRequestValidation
>["body"];
export type UpdateRequestStatusInput = z.infer<
  typeof updateRequestStatusValidation
>["body"];
export type CompleteVideoRequestInput = z.infer<
  typeof completeVideoRequestValidation
>["body"];
export type AddVideoReviewInput = z.infer<typeof addVideoReviewValidation>["body"];

const PlayerVideoRequestsValidation = {
  createVideoRequestValidation,
  updateRequestStatusValidation,
  completeVideoRequestValidation,
  addVideoReviewValidation,
  getVideoRequestsQueryValidation,
  requestIdParamValidation,
};

export default PlayerVideoRequestsValidation;
