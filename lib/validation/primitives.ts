import { z } from "zod";
import { LIMITS, PATTERNS } from "./limits";

// ── helpers ──────────────────────────────────────────────────────────────────

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

/** Wraps a string schema so blank input is treated as "not provided" (optional). */
export const optionalText = (schema: z.ZodString) =>
  z.preprocess(emptyToUndef, schema.optional());

const isDateString = (v: string) => !Number.isNaN(Date.parse(v));

const isNotFuture = (v: string) => {
  const d = new Date(v);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d.getTime() <= today.getTime();
};

const isTodayOrLater = (v: string) => {
  const d = new Date(v + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
};

const normalizePhone = (v: string) => v.replace(/[\s\-+]/g, "");
const isPhone = (v: string) => /^(91)?\d{10}$/.test(normalizePhone(v));
const isEmail = (v: string) => PATTERNS.email.test(v.trim().toLowerCase());

// ── primitives ───────────────────────────────────────────────────────────────

export const zName = (label: string) =>
  z
    .string()
    .trim()
    .min(LIMITS.nameMin, { message: `${label} is required.` })
    .max(LIMITS.nameMax, {
      message: `${label} must be at most ${LIMITS.nameMax} characters.`,
    })
    .regex(PATTERNS.name, { message: `${label} contains invalid characters.` });

export const zEmail = z
  .string()
  .trim()
  .toLowerCase()
  .min(LIMITS.emailMin, { message: "Please enter a valid email address." })
  .max(LIMITS.emailMax, {
    message: `Email must be at most ${LIMITS.emailMax} characters.`,
  })
  .regex(PATTERNS.email, { message: "Please enter a valid email address." });

export const zPassword = z
  .string()
  .min(LIMITS.passwordMin, {
    message: `Password must be at least ${LIMITS.passwordMin} characters.`,
  })
  .max(LIMITS.passwordMax, {
    message: `Password must be at most ${LIMITS.passwordMax} characters.`,
  })
  .regex(PATTERNS.password, {
    message: "Password must include at least one letter and one number.",
  });

export const zPhone = z
  .string()
  .trim()
  .refine(isPhone, {
    message: "Please enter a valid 10-digit phone number.",
  });

export const zOtp = z
  .string()
  .regex(PATTERNS.otp, { message: "Enter the 6-digit code." });

/** Reset/start-reset identifier — a valid email OR phone. */
export const zIdentifier = z
  .string()
  .trim()
  .min(1, { message: "Enter your email or phone number." })
  .refine((v) => isEmail(v) || isPhone(v), {
    message: "Enter a valid email or phone number.",
  });

export const zProfileName = optionalText(
  z
    .string()
    .trim()
    .min(1)
    .max(LIMITS.fullNameMax, {
      message: `Name must be at most ${LIMITS.fullNameMax} characters.`,
    })
    .regex(PATTERNS.name, { message: "Name contains invalid characters." }),
);

export const zNationality = optionalText(
  z
    .string()
    .trim()
    .min(LIMITS.nationalityMin, {
      message: `Nationality must be at least ${LIMITS.nationalityMin} characters.`,
    })
    .max(LIMITS.nationalityMax, {
      message: `Nationality must be at most ${LIMITS.nationalityMax} characters.`,
    })
    .regex(PATTERNS.nationality, {
      message: "Nationality contains invalid characters.",
    }),
);

export const zCountry = optionalText(
  z
    .string()
    .trim()
    .min(LIMITS.nationalityMin, {
      message: `Country must be at least ${LIMITS.nationalityMin} characters.`,
    })
    .max(LIMITS.nationalityMax, {
      message: `Country must be at most ${LIMITS.nationalityMax} characters.`,
    })
    .regex(PATTERNS.nationality, {
      message: "Country contains invalid characters.",
    }),
);

export const zProfession = optionalText(
  z
    .string()
    .trim()
    .min(LIMITS.professionMin, {
      message: `Profession must be at least ${LIMITS.professionMin} characters.`,
    })
    .max(LIMITS.professionMax, {
      message: `Profession must be at most ${LIMITS.professionMax} characters.`,
    })
    .regex(PATTERNS.profession, {
      message: "Profession contains invalid characters.",
    }),
);

export const zDob = z.preprocess(
  emptyToUndef,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Enter a valid date of birth." })
    .refine(isDateString, { message: "Enter a valid date of birth." })
    .refine(isNotFuture, { message: "Date of birth cannot be in the future." })
    .refine((v) => new Date(v).getFullYear() >= LIMITS.minYear, {
      message: "Enter a valid date of birth.",
    })
    .optional(),
);

export const zReviewQuote = z
  .string()
  .trim()
  .min(LIMITS.quoteMin, {
    message: `Please write at least ${LIMITS.quoteMin} characters.`,
  })
  .max(LIMITS.quoteMax, {
    message: `Review must be at most ${LIMITS.quoteMax} characters.`,
  });

export const zNotes = optionalText(
  z.string().trim().max(LIMITS.notesMax, {
    message: `Notes must be at most ${LIMITS.notesMax} characters.`,
  }),
);

export const zTravelDate = z
  .string()
  .min(1, { message: "Please select a travel date." })
  .refine(isDateString, { message: "Please select a valid date." })
  .refine(isTodayOrLater, { message: "Travel date must be today or later." });

export const zTravelersCount = z.coerce
  .number({ message: "Enter the number of travelers." })
  .int({ message: "Travelers must be a whole number." })
  .min(LIMITS.travelersMin, {
    message: `At least ${LIMITS.travelersMin} traveler is required.`,
  })
  .max(LIMITS.travelersMax, {
    message: `A maximum of ${LIMITS.travelersMax} travelers is allowed.`,
  });

export const zRating = z.coerce
  .number({ message: "Please select a rating." })
  .int()
  .min(LIMITS.ratingMin, { message: "Please select a rating." })
  .max(LIMITS.ratingMax, { message: `Rating must be between 1 and 5.` });

export const zPositiveId = z.coerce
  .number()
  .int()
  .positive({ message: "Invalid selection." });
