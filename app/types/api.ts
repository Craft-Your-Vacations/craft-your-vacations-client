export interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string };
  user: {
    name: string;
    username: string;
    links: { html: string };
  };
  links: { html: string };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DestinationPackage {
  id: number;
  key: string;
  days: number;
  price: number;
  title: string;
  excerpt: string;
}

export type ActivityType =
  | "transport"
  | "leisure"
  | "sightseeing"
  | "dining"
  | "cultural"
  | "adventure";

export interface Activity {
  time: string;
  description: string;
  type: ActivityType;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface PackageDetail {
  id: number;
  key: string;
  title: string;
  days: number;
  price: number;
  excerpt: string;
  itinerary: ItineraryDay[];
}

export interface Destination {
  id: number;
  slug: string;
  title: string;
  imagePath: string;
  content: string;
  minPackagePrice: number;
  isFeatured: boolean;
  destinationCities: string[];
}

export interface DestinationDetail extends Destination {
  packages: DestinationPackage[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  mobileNumber: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  profession?: string;
}

export interface SendChangeEmailRequest {
  newEmail: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  profession?: string;
}

export interface SendOtpRequest {
  mobileNumber: string;
}

export interface StartResetRequest {
  identifier?: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type DocumentType = "pan" | "passport";

export interface UserDocument {
  type: DocumentType;
  fileUrl: string;
  uploadedAt: string;
  updatedAt?: string;
}

export interface BookingPackage {
  id: number;
  key: string;
  title: string;
  days: number;
  price: number;
  excerpt: string;
  destinationSlug: string;
}

export interface CreateBookingRequest {
  packageId: number;
  travelersCount: number;
  travelDate: string; // "YYYY-MM-DD"
  notes?: string;
}

export interface Booking {
  id: number;
  packageId: number;
  package: BookingPackage;
  travelersCount: number;
  travelDate: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  hasReview?: boolean;
  confirmedItinerary?: ItineraryDay[];
  requiredDocuments?: DocumentType[];
}

export interface Review {
  id: number;
  bookingId: number;
  destinationSlug: string;
  packageTitle: string;
  travelDate: string;
  rating: number;
  quote: string;
  imagePaths: string[];
  authorName: string;
  authorProfession?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  bookingId: number;
  rating: number;
  quote: string;
}

// --- Admin types ---

export interface AdminBookingCustomer {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  nationality?: string;
  countryOfResidence?: string;
  profession?: string;
}

export interface AdminBooking extends Booking {
  customer: AdminBookingCustomer;
}

export interface AdminReview extends Review {
  isApproved: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  phoneVerified: boolean;
  nationality?: string;
  countryOfResidence?: string;
  profession?: string;
  dateOfBirth?: string;
  createdAt: string;
  totalBookings: number;
}

export interface AdminUpdateBookingRequest {
  status?: BookingStatus;
  travelersCount?: number;
  travelDate?: string;
  notes?: string;
  confirmedItinerary?: ItineraryDay[];
  requiredDocuments?: DocumentType[];
}

export interface CreateDestinationRequest {
  slug: string;
  title: string;
  imagePath: string;
  content: string;
  isFeatured: boolean;
  destinationCities: string[];
}

export interface CreatePackageRequest {
  key: string;
  title: string;
  price: number;
  days: number;
  excerpt: string;
  itinerary: ItineraryDay[];
}

export interface UpdatePackageRequest {
  title?: string;
  price?: number;
  days?: number;
  excerpt?: string;
  itinerary?: ItineraryDay[];
}
