import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  code: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  price: z.number().positive(),
  category: z.string().optional().default('Công nghệ'),
  stock: z.number().int().nonnegative().optional().default(10),
  image: z.string().url(),
  description: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductListSchema = z.array(ProductSchema);
export default ProductSchema;
