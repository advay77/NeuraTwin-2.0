const { z } = require("zod");

const emailSchema = z
  .string()
  .min(5, "Email too short")
  .max(255, "Email too long")
  .refine((val) => val.includes("@"), {
    message: "Email must contain @",
  })
  .refine((val) => val.includes("."), {
    message: "Email must contain .",
  })
  .refine(
    (val) => {
      const atIndex = val.indexOf("@");
      const lastDotIndex = val.lastIndexOf(".");
      // @ must come before last dot, and not at start or end
      return (
        atIndex > 0 &&
        lastDotIndex > atIndex + 1 &&
        lastDotIndex < val.length - 1
      );
    },
    {
      message: "Email format is invalid",
    }
  );

const emailObjectSchema = z.object({
  email: emailSchema,
});

module.exports = { emailSchema: emailObjectSchema };
