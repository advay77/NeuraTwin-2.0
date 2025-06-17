import { z } from "zod";
// This schema validates an email address.
// It checks that the email is a string, has a minimum length of 5 characters,
// and has a maximum length of 255 characters.
// It also checks that the email contains an "@" symbol and a "." symbol,
// and that the "@" symbol appears before the last "." symbol.

export const emailSchema = z.object({
  email: z
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
        return (
          atIndex > 0 &&
          lastDotIndex > atIndex + 1 &&
          lastDotIndex < val.length - 1
        );
      },
      {
        message: "Email format is invalid",
      }
    )
    .refine(
      (val) => {
        const tld = val.split(".").pop();
        return tld && tld.length >= 2; // e.g., ".com", ".in", ".org"
      },
      {
        message: "Email Format is Invalid",
      }
    ),
});

//   // This schema validates an OTP (One-Time Password).
export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
