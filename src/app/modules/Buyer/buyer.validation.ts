import { z } from 'zod';

export const createValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Buyer name is required',
      })
      .min(1, 'Buyer name cannot be empty'),

    phone: z
      .string({
        required_error: 'Phone number is required',
      })
      .length(11, 'Phone number must be exactly 11 digits'),

    address: z.string().optional(),

    totalPurchase: z.number().nonnegative().optional(),

    totalDue: z.number().nonnegative().optional(),
  }),
});

export const buyerValidationSchema = {
  createValidationSchema,
};
