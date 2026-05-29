"use client";

import Link from "next/link";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { CalendarDays, Star, Users, Clock } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import AdminPageHeader from "@/app/(admin)/components/AdminPageHeader";
import BookingStatusBadge from "@/app/(admin)/components/BookingStatusBadge";

export default function AdminDashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookings();
  const { data: reviews, isLoading: reviewsLoading } = useAdminReviews();
  const { data: customers, isLoading: customersLoading } = useAdminCustomers();

  const isLoading = bookingsLoading || reviewsLoading || customersLoading;

  if (isLoading) return <LoadingSpinner message="Loading dashboard…" fullScreen={false} />;

  const totalBookings = bookings?.length ?? 0;
  const pendingBookings = bookings?.filter((b) => b.status === "pending").length ?? 0;
  const pendingReviews = reviews?.filter((r) => !r.isApproved).length ?? 0;
  const totalCustomers = customers?.length ?? 0;

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarDays,
      href: "/admin/bookings",
      sub: `${pendingBookings} pending`,
    },
    {
      label: "Pending Reviews",
      value: pendingReviews,
      icon: Star,
      href: "/admin/reviews",
      sub: `${(reviews?.length ?? 0) - pendingReviews} approved`,
    },
    {
      label: "Customers",
      value: totalCustomers,
      icon: Users,
      href: "/admin/customers",
      sub: "total registered",
    },
    {
      label: "Confirmed",
      value: bookings?.filter((b) => b.status === "confirmed").length ?? 0,
      icon: Clock,
      href: "/admin/bookings?status=confirmed",
      sub: "bookings confirmed",
    },
  ];

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of CraftYourVacations operations"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href, sub }) => (
          <Link
            key={label}
            href={href}
            className="glass rounded-2xl p-6 flex flex-col gap-3 hover:bg-surface-high transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-text-muted uppercase tracking-widest">{label}</span>
              <Icon className="w-4 h-4 text-primary/60" />
            </div>
            <span className="text-display-sm text-text font-semibold">{value}</span>
            <span className="text-body-sm text-text-subtle">{sub}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-sm text-text">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-body-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {bookings?.slice(0, 5).map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between py-2 border-b border-outline last:border-0 hover:text-primary transition-colors"
              >
                <div>
                  <p className="text-body-sm text-text">{b.package.title}</p>
                  <p className="text-label-sm text-text-muted">{b.customer.name}</p>
                </div>
                <BookingStatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Pending reviews */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-sm text-text">Pending Reviews</h2>
            <Link href="/admin/reviews" className="text-body-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {reviews
              ?.filter((r) => !r.isApproved)
              .slice(0, 5)
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2 border-b border-outline last:border-0"
                >
                  <div>
                    <p className="text-body-sm text-text">{r.authorName}</p>
                    <p className="text-label-sm text-text-muted">{r.destinationSlug}</p>
                  </div>
                  <div className="flex items-center gap-1 text-label-sm text-primary">
                    <Star className="w-3 h-3 fill-primary" />
                    {r.rating}
                  </div>
                </div>
              ))}
            {reviews?.filter((r) => !r.isApproved).length === 0 && (
              <p className="text-body-sm text-text-muted">No pending reviews</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
