import { z } from "zod";


export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),

  phone: z.string().optional(),

  image: z.string().optional(),
});

const userProfileValidation = z.object({
  body: updateUserSchema
});

export type UpdateProfileInput = z.infer<typeof userProfileValidation>["body"];

const UserValidation = {
  userProfileValidation,
  updateUserSchema,
};

export default UserValidation;
