import { z } from "zod";

export const addOrUpdateCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, "productId is required"),
    quantity: z.coerce.number().int().min(1, "quantity must be at least 1"),
  }),
});

export type AddOrUpdateCartBody = z.infer<typeof addOrUpdateCartSchema>["body"];
