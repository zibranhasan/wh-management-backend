import { z } from 'zod';

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User Email is required!',
    }),
  }),
});

export const AuthValidation = {
  forgetPasswordValidationSchema,
};
