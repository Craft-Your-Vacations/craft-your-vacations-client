import { api } from "@/lib/api";
import type {
  Destination,
  DestinationDetail,
  PackageDetail,
  User,
  OtpResponse,
  RegisterRequest,
  UpdateProfileRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  StartResetRequest,
  ResetPasswordRequest,
  Booking,
  CreateBookingRequest,
  Review,
  CreateReviewRequest,
  AdminBooking,
  AdminReview,
  AdminUpdateBookingRequest,
  Customer,
  CreateDestinationRequest,
  CreatePackageRequest,
  UpdatePackageRequest,
  UserDocument,
  DocumentType,
} from "@/app/types/api";

export const destinationsApi = {
  getAll: () => api.get<Destination[]>("destinations"),
  getBySlug: (slug: string) => api.get<DestinationDetail>(`destinations/${slug}`),
};

export const packagesApi = {
  getBySlugAndKey: (slug: string, key: string) =>
    api.get<PackageDetail>(`destinations/${slug}/packages/${key}`),
};

export const authApi = {
  register: (body: RegisterRequest) => api.post<User>("auth/register", body),
  startReset: (body: StartResetRequest) =>
    api.post<OtpResponse>("auth/start-reset", body),
  resetPassword: (body: ResetPasswordRequest) =>
    api.post<OtpResponse>("auth/reset-password", body),
};

export const phoneApi = {
  sendOtp: (body: SendOtpRequest) =>
    api.post<OtpResponse>("phone/send-otp", body),
  verifyOtp: (body: VerifyOtpRequest) =>
    api.post<OtpResponse>("phone/verify-otp", body),
};

export const usersApi = {
  getProfile: () => api.get<User>("users/profile"),
  updateProfile: (body: UpdateProfileRequest) =>
    api.patch<User>("users/profile", body),
};

export const bookingsApi = {
  create: (body: CreateBookingRequest) => api.post<Booking>("bookings", body),
  getMyBookings: () => api.get<Booking[]>("bookings"),
  getById: (id: number) => api.get<Booking>(`bookings/${id}`),
};

export const documentsApi = {
  getMyDocuments: () => api.get<UserDocument[]>("users/documents"),
  uploadDocument: (type: DocumentType, formData: FormData) =>
    api.putForm<UserDocument>(`users/documents/${type}`, formData),
};

export const reviewsApi = {
  create: (body: CreateReviewRequest) => api.post<Review>("reviews", body),
  uploadImages: (id: number, formData: FormData) =>
    api.post<Review>(`reviews/${id}/images`, formData),
  getByDestination: (slug: string) =>
    api.get<Review[]>(`reviews/destination/${slug}`),
  getApproved: () => api.get<Review[]>("reviews/approved"),
};

export const adminApi = {
  // Bookings
  getBookings: (status?: string) =>
    api.get<AdminBooking[]>(`admin/bookings${status ? `?status=${status}` : ""}`),
  getBooking: (id: number) => api.get<AdminBooking>(`admin/bookings/${id}`),
  updateBooking: (id: number, body: AdminUpdateBookingRequest) =>
    api.patch<AdminBooking>(`admin/bookings/${id}`, body),
  // Reviews
  getReviews: () => api.get<AdminReview[]>("admin/reviews"),
  approveReview: (id: number) =>
    api.post<AdminReview>(`admin/reviews/${id}/approve`, {}),
  deleteReview: (id: number) => api.delete<void>(`admin/reviews/${id}`),
  // Customers
  getCustomers: () => api.get<Customer[]>("admin/users"),
  getCustomer: (id: string) => api.get<Customer>(`admin/users/${id}`),
  // Destinations
  createDestination: (body: CreateDestinationRequest) =>
    api.post<Destination>("admin/destinations", body),
  updateDestination: (id: number, body: Partial<CreateDestinationRequest>) =>
    api.patch<Destination>(`admin/destinations/${id}`, body),
  deleteDestination: (id: number) => api.delete<void>(`admin/destinations/${id}`),
  // Packages
  createPackage: (destId: number, body: CreatePackageRequest) =>
    api.post<PackageDetail>(`admin/destinations/${destId}/packages`, body),
  updatePackage: (destId: number, key: string, body: UpdatePackageRequest) =>
    api.put<PackageDetail>(`admin/destinations/${destId}/packages/${key}`, body),
  deletePackage: (destId: number, key: string) =>
    api.delete<void>(`admin/destinations/${destId}/packages/${key}`),
};
