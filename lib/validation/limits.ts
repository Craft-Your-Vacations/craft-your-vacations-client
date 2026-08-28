// Canonical validation limits — MUST stay in sync with the backend equivalents in
// CYV-API/.../Validators/ValidationRules.cs (the plan's rules table is the source of truth).

export const LIMITS = {
  nameMin: 1,
  nameMax: 50,
  fullNameMax: 100,
  emailMin: 5,
  emailMax: 254,
  passwordMin: 8,
  passwordMax: 72,
  nationalityMin: 2,
  nationalityMax: 56,
  professionMin: 2,
  professionMax: 60,
  tokenMax: 512,
  notesMax: 500,
  quoteMin: 10,
  quoteMax: 600,
  loginPasswordMax: 72,

  travelersMin: 1,
  travelersMax: 50,
  ratingMin: 1,
  ratingMax: 5,
  minYear: 1900,

  // Admin
  slugMax: 80,
  titleMax: 100,
  imagePathMax: 300,
  contentMax: 5000,
  excerptMax: 300,
  cityMin: 1,
  cityMax: 56,
  citiesListMax: 30,
  daysMin: 1,
  daysMax: 60,
  priceMin: 0,
  priceMax: 10_000_000,
  activityDescriptionMax: 300,
  activityTypeMax: 40,
  activitiesPerDayMax: 20,
  itineraryDaysMax: 60,
  requiredDocumentMax: 100,
  requiredDocumentsListMax: 20,
} as const;

export const FILES = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  maxSizeLabel: "5 MB",
  documentExtensions: [".pdf", ".jpg", ".jpeg", ".png"] as const,
  reviewImageExtensions: [".jpg", ".jpeg", ".png", ".webp"] as const,
  reviewImagesMax: 5,
} as const;

export const PATTERNS = {
  name: /^[\p{L} .'-]+$/u,
  nationality: /^[\p{L} '-]+$/u,
  profession: /^[\p{L}0-9 .'&/-]+$/u,
  city: /^[\p{L} -]+$/u,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  otp: /^\d{6}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  time: /^([01]\d|2[0-3]):[0-5]\d$/,
  // At least one letter and one digit.
  password: /^(?=.*[A-Za-z])(?=.*\d).+$/,
} as const;

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
