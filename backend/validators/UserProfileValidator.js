const { z } = require("zod");

// Helper to check DOB age
const MIN_AGE = 10;
const today = new Date();
const twelveYearsAgo = new Date(
  today.getFullYear() - MIN_AGE,
  today.getMonth(),
  today.getDate()
);

const userProfileSchema = z.object({
  name: z.string().trim().toLowerCase().min(3),
  email: z.string().email(),
  dateOfBirth: z.string().refine(
    (date) => {
      const dob = new Date(date);
      return dob < twelveYearsAgo;
    },
    {
      message: `User must be at least ${MIN_AGE} years old`,
    }
  ),
  gender: z.string().min(1),
  occupation: z.string().min(1),
  goalTitle: z.string().min(3),
  goalDescription: z.string().min(10),
  goalStartDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  goalEndDate: z.string().refine((date) => !isNaN(Date.parse(date))),
});

module.exports = {
  userProfileSchema,
};
