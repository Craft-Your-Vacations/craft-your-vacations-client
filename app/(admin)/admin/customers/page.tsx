"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import { ChevronRight, Search } from "lucide-react";
import AdminPageHeader from "@/app/(admin)/components/AdminPageHeader";
import Pagination from "@/components/Pagination/Pagination";

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminCustomers(page);
  const [search, setSearch] = useState("");

  if (isLoading) return <LoadingSpinner message="Loading customers…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );

  const customers = data?.data ?? [];
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.mobileNumber.includes(search)
  );

  return (
    <div className="p-8 pb-24">
      <AdminPageHeader
        title="Customers"
        subtitle={`${data?.total ?? 0} registered customers`}
      />

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-highest border border-outline rounded-xl pl-9 pr-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline">
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest">
                Name
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Email
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden lg:table-cell">
                Phone
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden sm:table-cell">
                Bookings
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-body-md text-text-muted">
                  No customers found
                </td>
              </tr>
            )}
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-outline last:border-0 hover:bg-surface-high/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-body-sm text-text font-medium">{customer.name}</p>
                  {customer.nationality && (
                    <p className="text-label-sm text-text-muted">{customer.nationality}</p>
                  )}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-body-sm text-text">{customer.email}</p>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <p className="text-body-sm text-text">{customer.mobileNumber}</p>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="px-2.5 py-1 rounded-full text-label-sm bg-primary/10 text-primary">
                    {customer.totalBookings}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
