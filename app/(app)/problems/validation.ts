import { z } from "zod";

// Assuming you have an enum for statusEnum
const statusEnum = z.enum(["active", "inactive"]); // Replace with actual enum values

export const problemSchema = z.object({
  id: z.number().int().optional(), // serial primary key, auto-generated
  operator: z.string().max(255),
  commutator: z.string().max(255),
  product_id: z.string().max(255),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
  note: z.string().max(1024).optional().nullable(),
  status: statusEnum.optional().nullable(),
  answer: z.string().optional().nullable(),
});
