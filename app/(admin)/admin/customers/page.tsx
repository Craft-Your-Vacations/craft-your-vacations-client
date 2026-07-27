"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Surface from "@/components/Surface/Surface";
import EmptyState from "@/components/EmptyState/EmptyState";
import FormField from "@/components/FormField/FormField";
import { ChevronRight, Search, Users } from "lucide-react";
import AdminPageHeader from "@/app/(admin)/components/AdminPageHeader";
import Pagination from "@/components/Pagination/Pagination";

export default function AdminCustomersPage() {
  const router = useRouter();
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

      <FormField
        id="customer-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, phone…"
        icon={<Search className="w-4 h-4" />}
        className="mb-6 max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
          title="No customers found"
        />
      ) : (
      <Surface variant="table">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline">
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest">
                Name
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Email
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Phone
              </th>
              <th className="text-left px-6 py-4 text-label-sm text-text-muted uppercase tracking-widest hidden md:table-cell">
                Bookings
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => router.push(`/admin/customers/${customer.id}`)}
                className="border-b border-outline last:border-0 hover:bg-surface-high/50 transition-colors cursor-pointer"
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
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-body-sm text-text">{customer.mobileNumber}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="px-2.5 py-1 rounded-full text-label-sm bg-primary/10 text-primary">
                    {customer.totalBookings}
                  </span>
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
