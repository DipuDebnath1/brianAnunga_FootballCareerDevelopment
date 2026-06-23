import { z } from "zod";

const updateProfileValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileValidation>["body"];

const UserValidation = {
  updateProfileValidation,
};

export default UserValidation;
