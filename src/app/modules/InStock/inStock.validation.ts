import { z } from 'zod';

export const productValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name is required'),
  }),
});

export const stockInValidationSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().min(1, 'Invoice number is required'),
    vehicleNumber: z.string().optional(),
    supplierName: z.string().min(1, 'Supplier name is required'),
    productId: z.string(),
    quantity: z.number().min(1, 'quantity must be 1'),
    price: z.number().min(1, 'quantity must be 1'),
    date: z.date().optional(),
  }),
});
export const updateStockInValidationSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().min(1, 'Invoice number is required').optional(),
    vehicleNumber: z.string().optional(),
    supplierName: z.string().min(1, 'Supplier name is required').optional(),
    products: z.array(productValidationSchema).optional(),
    productId: z.string().optional(),
    quantity: z.number().min(1, 'quantity must be 1').optional(),
    price: z.number().min(1, 'quantity must be 1').optional(),
    date: z.date().optional().optional(),
  }),
});

export const updateProductValidationSchema = z.object({
  productName: z.string().min(1, 'Product name is required').optional(),
  productQuantity: z.number().min(1, 'Quantity must be at least 1').optional(),
  productPrice: z.number().min(0, 'Price must be non-negative').optional(),
});
