import { z } from 'zod';

export const productValidationSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productQuantity: z.number().min(1, 'Quantity must be at least 1'),
  productPrice: z.number().min(0, 'Price must be non-negative'),
});

export const stockInValidationSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().min(1, 'Invoice number is required'),
    vehicleNumber: z.string().optional(),
    supplierName: z.string().min(1, 'Supplier name is required'),
    products: z.array(productValidationSchema),
    date: z.date().optional(),
  }),
});
