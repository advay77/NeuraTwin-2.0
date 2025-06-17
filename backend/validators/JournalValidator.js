// validators/journalValidator.js
const { z } = require("zod");

const journalSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, "Journal must be at least 10 characters")
    .max(2500, "Journal must not exceed 2500 characters")
    .refine((val) => val.trim().split(/\s+/).length <= 250, {
      message: "Journal must not exceed 250 words",
    }),
});

module.exports = { journalSchema };
