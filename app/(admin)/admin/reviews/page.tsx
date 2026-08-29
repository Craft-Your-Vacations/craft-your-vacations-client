"use client";

import { useState } from "react";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useAdminApproveReview } from "@/hooks/useAdminApproveReview";
import { useAdminDeleteReview } from "@/hooks/useAdminDeleteReview";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import Surface from "@/components/Surface/Surface";
import EmptyState from "@/components/EmptyState/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Image from "next/image";
import { Star, Check, Trash2 } from "lucide-react";
import AdminPageHeader from "@/app/(admin)/components/AdminPageHeader";
import { useToastStore } from "@/stores/useToastStore";
import AdminFilterTabs from "@/app/(admin)/components/AdminFilterTabs";
import Pagination from "@/components/Pagination/Pagination";
import { REVIEW_TABS, formatDate } from "@/lib/constants";

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);
  const isApproved = activeTab === "approved" ? true : false;
  const { data, isLoading, isError, error, refetch } = useAdminReviews(page, isApproved);
  const approveReview = useAdminApproveReview();
  const deleteReview = useAdminDeleteReview();
  const [confirmApproveId, setConfirmApproveId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  if (isLoading) return <LoadingSpinner message="Loading reviews…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );

  const reviews = data?.data ?? [];

  return (
    <div className="p-8 pb-24">
      <AdminPageHeader
        title="Reviews"
        subtitle={`${data?.total ?? 0} ${activeTab === "approved" ? "approved" : "pending approval"}`}
      />

      <AdminFilterTabs
        tabs={REVIEW_TABS}
        active={activeTab}
        onChange={(t) => { setActiveTab(t); setPage(1); }}
      />

      {reviews.length === 0 && (
        <EmptyState
          icon={<Star className="w-10 h-10 text-primary/50" strokeWidth={1.5} />}
          title="No reviews in this category"
        />
      )}

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <Surface key={review.id} className="gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-headline-sm text-text">{review.authorName}</span>
                  {review.authorProfession && (
                    <span className="text-body-sm text-text-muted">· {review.authorProfession}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-label-sm text-text-muted">
                  <span>{review.destinationSlug}</span>
                  <span>·</span>
                  <span>{review.packageTitle}</span>
                  <span>·</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= review.rating ? "fill-primary text-primary" : "text-text-subtle"}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-body-md text-text leading-relaxed">&ldquo;{review.quote}&rdquo;</p>

            {review.imagePaths?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {review.imagePaths.map((path, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={path}
                      alt="Review"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 border-t border-outline">
              {!review.isApproved && (
                <Button
                  variant="primary"
                  onClick={() => setConfirmApproveId(review.id)}
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setConfirmDeleteId(review.id)}
                className="hover:text-error hover:bg-error/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Surface>
        ))}
      </div>

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        isOpen={confirmApproveId !== null}
        title="Approve this review?"
        message="This review will be published publicly on the site."
        confirmLabel="Yes, approve"
        variant="warning"
        isPending={approveReview.isPending}
        onConfirm={() => {
          if (confirmApproveId !== null)
            approveReview.mutate(confirmApproveId, {
              onSuccess: () => {
                setConfirmApproveId(null);
                addToast({ key: "approve-review", type: "success", message: "Review approved" });
              },
              onError: (err) => {
                addToast({ key: "approve-review", type: "error", message: err instanceof Error ? err.message : "Failed to approve review" });
              },
            });
        }}
        onCancel={() => setConfirmApproveId(null)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="Delete this review?"
        message="This review will be permanently removed and cannot be recovered."
        confirmLabel="Yes, delete"
        variant="danger"
        isPending={deleteReview.isPending}
        onConfirm={() => {
          if (confirmDeleteId !== null)
            deleteReview.mutate(confirmDeleteId, {
              onSuccess: () => {
                setConfirmDeleteId(null);
                addToast({ key: "delete-review", type: "success", message: "Review deleted" });
              },
              onError: (err) => {
                addToast({ key: "delete-review", type: "error", message: err instanceof Error ? err.message : "Failed to delete review" });
              },
            });
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
