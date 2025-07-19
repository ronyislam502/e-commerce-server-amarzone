import { z } from "zod";

const createSellerValidationSchema = z.object({
  shop: z.string().min(1, "Shop ID is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  shippingTime: z.number().min(0, "Shipping time is required"),
});

const updateSellerValidationSchema = z.object({
  shop: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  shippingTime: z.number().optional(),
});

const addShopProductValidation = z.object({
  body: z.object({
    asin: z.string(),
    seller: createSellerValidationSchema,
  }),
});

export const ShopProductValidations = {
  addShopProductValidation,
  updateSellerValidationSchema,
};
