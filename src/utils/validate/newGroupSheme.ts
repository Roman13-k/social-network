import z from "zod";

export const newGroupSchema = z.object({
  uuids: z
    .array(z.uuid("Invalid UUID"))
    .min(1, "Add at least one participant")
    .max(5, "You cannot add more than 5 participants"),
  name: z.string().min(3, "min 3 chars").max(20, "max 20 chars"),
});

export type NewGroupSchema = z.infer<typeof newGroupSchema>;
