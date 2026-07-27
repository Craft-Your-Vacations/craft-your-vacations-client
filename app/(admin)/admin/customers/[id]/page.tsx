"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminCustomer } from "@/hooks/useAdminCustomer";
import { useAdminCustomerBookings } from "@/hooks/useAdminCustomerBookings";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Surface from "@/components/Surface/Surface";
import {
  CalendarDays,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Users,
  ChevronRight,
} from "lucide-react";
import BackButton from "@/components/BackButton/BackButton";
import BookingStatusBadge, {
  formatMonth,
} from "@/app/(admin)/components/BookingStatusBadge";

export default function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    data: customer,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCustomer(id);
  const { data: customerBookings = [], isLoading: bookingsLoading } = useAdminCustomerBookings(id);

  if (isLoading || bookingsLoading)
    return <LoadingSpinner message="Loading customer…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  if (!customer)
    return (
      <div className="p-8">
        <p className="text-body-md text-text-muted">Customer not found.</p>
      </div>
    );

  return (
    <div className="p-8 max-w-4xl">
      <BackButton className="mb-6" />

      <div className="mb-6">
        <h1 className="text-display-sm text-text">{customer.name}</h1>
        <p className="text-body-md text-text-muted mt-1">
          Member since{" "}
          {new Date(customer.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Profile card */}
        <Surface className="gap-4">
          <h2 className="text-headline-sm text-text">Profile</h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary/60 shrink-0" />
              <p className="text-body-sm text-text">{customer.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary/60 shrink-0" />
              <p className="text-body-sm text-text">{customer.mobileNumber}</p>
            </div>
            {customer.nationality && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary/60 shrink-0" />
                <p className="text-body-sm text-text">{customer.nationality}</p>
              </div>
            )}
            {customer.countryOfResidence && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary/60 shrink-0" />
                <p className="text-body-sm text-text-muted">
                  Lives in {customer.countryOfResidence}
                </p>
              </div>
            )}
            {customer.profession && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary/60 shrink-0" />
                <p className="text-body-sm text-text">{customer.profession}</p>
              </div>
            )}
            {customer.dateOfBirth && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary/60 shrink-0" />
                <p className="text-body-sm text-text">
                  {new Date(customer.dateOfBirth).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </Surface>

        {/* Stats */}
        <Surface className="gap-4">
          <h2 className="text-headline-sm text-text">Stats</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-outline">
              <span className="text-body-sm text-text-muted">
                Total Bookings
              </span>
              <span className="text-headline-sm text-text">
                {customer.totalBookings}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-outline">
              <span className="text-body-sm text-text-muted">
                Phone Verified
              </span>
              <span
                className={`text-label-sm px-2 py-0.5 rounded-full ${customer.phoneVerified ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}
              >
                {customer.phoneVerified ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </Surface>
      </div>

      {/* Booking history */}
      <Surface variant="table">
        <div className="px-6 py-4 border-b border-outline">
          <h2 className="text-headline-sm text-text">Booking History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline">
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest">
                Package
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Month
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Travelers
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {customerBookings.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-body-md text-text-muted"
                >
                  No bookings yet
                </td>
              </tr>
            )}
            {customerBookings.map((b) => (
              <tr
                key={b.id}
                onClick={() => router.push(`/admin/bookings/${b.id}`)}
                className="border-b border-outline last:border-0 hover:bg-surface-high/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <p className="text-body-sm text-text">{b.package.title}</p>
                  <p className="text-label-sm text-text-muted">
                    {b.package.destinationSlug}
                  </p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-body-sm text-text">
                    <CalendarDays className="w-3.5 h-3.5 text-primary/60" />
                    {formatMonth(b.travelDate)}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-body-sm text-text">
                    <Users className="w-3.5 h-3.5 text-primary/60" />
                    {b.travelersCount}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <BookingStatusBadge status={b.status} />
                </td>
                <td className="px-6 py-4">
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}
