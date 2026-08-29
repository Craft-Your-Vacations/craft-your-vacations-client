import { z } from "zod";
import { LIMITS, PATTERNS } from "./limits";
import {
  zName,
  zEmail,
  zPassword,
  zPhone,
  zOtp,
  zIdentifier,
  zProfileName,
  zNationality,
  zCountry,
  zProfession,
  zDob,
  zReviewQuote,
  zNotes,
  zTravelDate,
  zTravelersCount,
  zRating,
} from "./primitives";

// ── Customer schemas ─────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    firstName: zName("First name"),
    lastName: zName("Last name"),
    email: zEmail,
    password: zPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .max(LIMITS.emailMax, { message: "Email is too long." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .max(LIMITS.loginPasswordMax, { message: "Password is too long." }),
});

export const startResetSchema = z.object({ identifier: zIdentifier });

export const resetPasswordSchema = z
  .object({
    identifier: zIdentifier,
    otp: zOtp,
    newPassword: zPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const phoneSchema = z.object({ phone: zPhone });
export const otpSchema = z.object({ otp: zOtp });

export const profileSchema = z.object({
  name: zProfileName,
  dateOfBirth: zDob,
  nationality: zNationality,
  countryOfResidence: zCountry,
  profession: zProfession,
});

export const changeEmailSchema = z.object({ newEmail: zEmail });

export const bookingSchema = z.object({
  travelersCount: zTravelersCount,
  travelDate: zTravelDate,
  notes: zNotes,
});

export const reviewSchema = z.object({
  rating: zRating,
  quote: zReviewQuote,
});

// ── Admin schemas (Phase B) ──────────────────────────────────────────────────

const zSlug = z
  .string()
  .trim()
  .min(1, { message: "Slug is required." })
  .max(LIMITS.slugMax, { message: `Slug must be at most ${LIMITS.slugMax} characters.` })
  .regex(PATTERNS.slug, {
    message: "Use lowercase letters, numbers and hyphens only.",
  });

const zTitle = z
  .string()
  .trim()
  .min(1, { message: "Title is required." })
  .max(LIMITS.titleMax, { message: `Title must be at most ${LIMITS.titleMax} characters.` });

const zImagePath = z
  .string()
  .trim()
  .min(1, { message: "Image path is required." })
  .max(LIMITS.imagePathMax, {
    message: `Image path must be at most ${LIMITS.imagePathMax} characters.`,
  });

const zContent = z
  .string()
  .trim()
  .min(1, { message: "Content is required." })
  .max(LIMITS.contentMax, {
    message: `Content must be at most ${LIMITS.contentMax} characters.`,
  });

const zExcerpt = z
  .string()
  .trim()
  .min(1, { message: "Excerpt is required." })
  .max(LIMITS.excerptMax, {
    message: `Excerpt must be at most ${LIMITS.excerptMax} characters.`,
  });

const zCity = z
  .string()
  .trim()
  .min(LIMITS.cityMin, { message: "City name is required." })
  .max(LIMITS.cityMax, { message: `City must be at most ${LIMITS.cityMax} characters.` })
  .regex(PATTERNS.city, { message: "City contains invalid characters." });

const zPrice = z.coerce
  .number({ message: "Enter a price." })
  .min(LIMITS.priceMin, { message: "Price cannot be negative." })
  .max(LIMITS.priceMax, { message: "Price is too large." });

const zDays = z.coerce
  .number({ message: "Enter the number of days." })
  .int({ message: "Days must be a whole number." })
  .min(LIMITS.daysMin, { message: `Must be at least ${LIMITS.daysMin} day.` })
  .max(LIMITS.daysMax, { message: `Must be at most ${LIMITS.daysMax} days.` });

export const activitySchema = z.object({
  time: z.string().regex(PATTERNS.time, { message: "Use HH:mm (24-hour)." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required." })
    .max(LIMITS.activityDescriptionMax, {
      message: `Description must be at most ${LIMITS.activityDescriptionMax} characters.`,
    }),
  type: z.enum(
    ["transport", "leisure", "sightseeing", "dining", "cultural", "adventure"],
    { message: "Invalid activity type." },
  ),
});

export const itineraryDaySchema = z.object({
  dayNumber: z.coerce.number().int().min(1, { message: "Invalid day number." }),
  title: zTitle,
  activities: z.array(activitySchema).max(LIMITS.activitiesPerDayMax, {
    message: `A day can have at most ${LIMITS.activitiesPerDayMax} activities.`,
  }),
});

export const itinerarySchema = z
  .array(itineraryDaySchema)
  .min(1, { message: "Add at least one itinerary day." })
  .max(LIMITS.itineraryDaysMax, {
    message: `At most ${LIMITS.itineraryDaysMax} days allowed.`,
  });

export const destinationSchema = z.object({
  slug: zSlug,
  title: zTitle,
  imagePath: zImagePath,
  content: zContent,
  isFeatured: z.boolean(),
  destinationCities: z.array(zCity).max(LIMITS.citiesListMax, {
    message: `At most ${LIMITS.citiesListMax} cities allowed.`,
  }),
});

export const packageSchema = z.object({
  key: zSlug,
  title: zTitle,
  price: zPrice,
  days: zDays,
  excerpt: zExcerpt,
  itinerary: itinerarySchema,
});

// Destination edit — slug is not editable.
export const destinationEditSchema = destinationSchema.omit({ slug: true });

// Package edit — key is not editable.
export const packageEditSchema = packageSchema.omit({ key: true });

// Admin booking patch — admins may set past travel dates (unlike customer booking).
export const adminBookingPatchSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"], {
    message: "Select a valid status.",
  }),
  travelersCount: zTravelersCount,
  travelDate: z
    .string()
    .min(1, { message: "Please select a travel date." })
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Please select a valid date.",
    }),
  notes: zNotes,
});
