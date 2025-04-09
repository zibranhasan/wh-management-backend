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
export const updateStockInValidationSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().min(1, 'Invoice number is required').optional(),
    vehicleNumber: z.string().optional(),
    supplierName: z.string().min(1, 'Supplier name is required').optional(),
    products: z.array(productValidationSchema).optional(),
    date: z.date().optional().optional(),
  }),
});

export const updateProductValidationSchema = z.object({
  productName: z.string().min(1, 'Product name is required').optional(),
  productQuantity: z.number().min(1, 'Quantity must be at least 1').optional(),
  productPrice: z.number().min(0, 'Price must be non-negative').optional(),
});
