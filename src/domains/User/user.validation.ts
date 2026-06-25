import { z } from "zod";
import { AllRoles } from "../../utills/roles";

const roleFilterValues = Object.keys(AllRoles) as [
  keyof typeof AllRoles,
  ...(keyof typeof AllRoles)[],
];

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  phone: z.string().optional(),
});

export const updateProfileRequestSchema = z.object({
  user: updateUserSchema.optional(),
  profile: z.record(z.string(), z.unknown()).optional(),
});

export const getAllUsersQuerySchema = z.object({
  query: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(roleFilterValues).optional(),
    select: z.string().optional(),
  }),
});

export const getSingleUserQuerySchema = z.object({
  query: z.object({
    select: z.string().optional(),
    profileSelect: z.string().optional(),
  }),
  params: z.object({
    userId: z.string().min(1, "User id is required"),
  }),
});

export const getSelfProfileQuerySchema = z.object({
  query: z.object({
    select: z.string().optional(),
    profileSelect: z.string().optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>["query"];
export type GetSingleUserQuery = z.infer<
  typeof getSingleUserQuerySchema
>["query"];

const UserValidation = {
  updateUserSchema,
  updateProfileRequestSchema,
  getAllUsersQuerySchema,
  getSingleUserQuerySchema,
  getSelfProfileQuerySchema,
};

export default UserValidation;
