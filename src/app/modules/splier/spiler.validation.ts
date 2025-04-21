import { z } from 'zod';

const createValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Buyer name is Required' })
      .min(3, 'Name must be 3  characters.'),
    phone: z
      .string({ required_error: 'Phone is Required' })
      .min(11, 'Phone must be Required'),
    address: z.string({ required_error: 'Address is Required' }),
    companyName: z.string({ required_error: 'Company Name is Requied' }),
  }),
});

export const splierValidationSchema = {
  createValidationSchema,
};
