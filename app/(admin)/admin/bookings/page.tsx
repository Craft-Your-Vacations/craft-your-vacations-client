"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Surface from "@/components/Surface/Surface";
import EmptyState from "@/components/EmptyState/EmptyState";
import { CalendarDays, Users, ChevronRight } from "lucide-react";
import AdminPageHeader from "@/app/(admin)/components/AdminPageHeader";
import AdminFilterTabs from "@/app/(admin)/components/AdminFilterTabs";
import BookingStatusBadge, { formatMonth } from "@/app/(admin)/components/BookingStatusBadge";
import Pagination from "@/components/Pagination/Pagination";
import { BOOKING_STATUSES } from "@/lib/constants";

const STATUSES = [
  { value: "", label: "All" },
  ...BOOKING_STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminBookings(
    activeStatus || undefined,
    page
  );

  if (isLoading) return <LoadingSpinner message="Loading bookings…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );

  const bookings = data?.data ?? [];

  return (
    <div className="p-8 pb-24">
      <AdminPageHeader
        title="Bookings"
        subtitle={`${data?.total ?? 0} total bookings`}
      />

      <AdminFilterTabs
        tabs={STATUSES}
        active={activeStatus}
        onChange={(s) => { setActiveStatus(s); setPage(1); }}
      />

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
          title="No bookings found"
        />
      ) : (
      <Surface variant="table">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline">
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest">
                Package
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Customer
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Travel Month
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
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                className="border-b border-outline last:border-0 hover:bg-surface-high/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <p className="text-body-sm text-text font-medium">{booking.package.title}</p>
                  <p className="text-label-sm text-text-muted">{booking.package.destinationSlug}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-body-sm text-text">{booking.customer.name}</p>
                  <p className="text-label-sm text-text-muted">{booking.customer.email}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-body-sm text-text">
                    <CalendarDays className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    {formatMonth(booking.travelDate)}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-body-sm text-text">
                    <Users className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    {booking.travelersCount}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4">
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
      )}

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
