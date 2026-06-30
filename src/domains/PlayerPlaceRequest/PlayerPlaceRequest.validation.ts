import { z } from "zod";
import { PlayerPlacementStatus } from "./PlayerPlaceRequest.interface";

const requestIdParam = z.object({
  requestId: z.string().min(1, "Request id is required"),
});

const videoUrlSchema = z
  .string()
  .url("Video must be a valid URL")
  .refine((value) => value.startsWith("https://"), {
    message: "Video must be a valid HTTPS URL",
  });

export const createPlacementValidation = z.object({
  body: z.object({
    agentId: z.string().min(1, "Agent id is required"),
    preferredClub: z.string().min(1, "Preferred club is required"),
    preferredLeagues: z.string().min(1, "Preferred leagues are required"),
    urgencyLevel: z.string().min(1, "Urgency level is required"),
    additionalInfo: z.string().min(1, "Additional info is required"),
    video: videoUrlSchema,
  }),
});

export const updatePlacementStatusValidation = z.object({
  body: z.object({
    status: z.enum([
      PlayerPlacementStatus.accept,
      PlayerPlacementStatus.decline,
    ]),
  }),
  params: requestIdParam,
});

export const getPlacementsQueryValidation = z.object({
  query: z.object({
    status: z
      .enum(Object.values(PlayerPlacementStatus) as [string, ...string[]])
      .optional(),
  }),
});

export const requestIdParamValidation = z.object({
  params: requestIdParam,
});

export type CreatePlacementInput = z.infer<
  typeof createPlacementValidation
>["body"];
export type UpdatePlacementStatusInput = z.infer<
  typeof updatePlacementStatusValidation
>["body"];

const PlayerPlaceRequestValidation = {
  createPlacementValidation,
  updatePlacementStatusValidation,
  getPlacementsQueryValidation,
  requestIdParamValidation,
};

export default PlayerPlaceRequestValidation;
