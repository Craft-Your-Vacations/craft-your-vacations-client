"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSignOut } from "@/hooks/useSignOut";
import { useQueryClient } from "@tanstack/react-query";
import { CircleUser, BadgeCheck } from "lucide-react";
import AuthCard from "@/components/AuthCard/AuthCard";
import FormField from "@/components/FormField/FormField";
import Button from "@/components/Button/Button";
import DocumentUpload from "@/components/DocumentUpload/DocumentUpload";
import EmailVerificationBanner from "@/components/EmailVerificationBanner/EmailVerificationBanner";
import ChangeEmailDialog from "@/components/ChangeEmailDialog/ChangeEmailDialog";
import ChangePhoneDialog from "@/components/ChangePhoneDialog/ChangePhoneDialog";
import DocumentViewerDialog from "@/components/DocumentViewerDialog/DocumentViewerDialog";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useSendEmailVerification } from "@/hooks/useSendEmailVerification";
import { useSendChangeEmail } from "@/hooks/useSendChangeEmail";
import { queryKeys } from "@/lib/queryKeys";
import { profileSchema } from "@/lib/validation/schemas";
import { getFieldErrors } from "@/lib/validation/getFieldErrors";
import { LIMITS } from "@/lib/validation/limits";
import { useToastStore } from "@/stores/useToastStore";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import type { UserDocument, DocumentType } from "@/app/types/api";

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  pan: "PAN Card",
  passport: "Passport",
};

export default function ProfilePage() {
  const supabase = getSupabaseBrowserClient();
  const signOut = useSignOut();
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const [viewDoc, setViewDoc] = useState<UserDocument | null>(null);
  const { data: documents } = useUserDocuments();
  const { mutate: uploadDocument, isPending: isUploading, variables: uploadingVars } = useUploadDocument();

  const [activeTab, setActiveTab] = useState<"info" | "documents">("info");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [profession, setProfession] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Email verification banner
  const { mutate: sendEmailVerification, isPending: isSendingVerif, error: sendVerifError } = useSendEmailVerification();
  const [emailVerifSent, setEmailVerifSent] = useState(false);

  // Change email modal
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const { mutate: sendChangeEmail, isPending: isSendingChangeEmail, error: sendChangeEmailError, reset: resetChangeEmail } = useSendChangeEmail();

  // Change phone modal
  const [changePhoneOpen, setChangePhoneOpen] = useState(false);
  const { mutate: sendOtp, isPending: isSendingPhoneOtp, error: sendPhoneError, reset: resetSendOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingPhone, error: verifyPhoneError, reset: resetVerifyOtp } = useVerifyOtp();

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setDateOfBirth(profile.dateOfBirth ?? "");
    setNationality(profile.nationality ?? "");
    setCountryOfResidence(profile.countryOfResidence ?? "");
    setProfession(profile.profession ?? "");
  }, [profile]);

  const initial = {
    name: profile?.name ?? "",
    dateOfBirth: profile?.dateOfBirth ?? "",
    nationality: profile?.nationality ?? "",
    countryOfResidence: profile?.countryOfResidence ?? "",
    profession: profile?.profession ?? "",
  };

  const isDirty =
    name !== initial.name ||
    dateOfBirth !== initial.dateOfBirth ||
    nationality !== initial.nationality ||
    countryOfResidence !== initial.countryOfResidence ||
    profession !== initial.profession;

  const docMap = Object.fromEntries((documents ?? []).map((d) => [d.type, d]));

  function handleUpload(type: DocumentType, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    uploadDocument(
      { type, formData },
      {
        onSuccess: () => {
          addToast({ key: `upload-${type}`, type: "success", message: `${DOCUMENT_LABELS[type]} uploaded successfully` });
        },
        onError: (err) => {
          addToast({ key: `upload-${type}`, type: "error", message: err instanceof Error ? err.message : `Failed to upload ${DOCUMENT_LABELS[type]}` });
        },
      },
    );
  }

  const handleSave = () => {
    const fieldErrors = getFieldErrors(profileSchema, {
      name,
      dateOfBirth,
      nationality,
      countryOfResidence,
      profession,
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    updateProfile(
      { name, dateOfBirth, nationality, countryOfResidence, profession },
      {
        onSuccess: async (updatedUser) => {
          queryClient.setQueryData(queryKeys.profile.me(), updatedUser);
          addToast({ key: "update-profile", type: "success", message: "Profile updated successfully" });
        },
        onError: (err) => {
          addToast({ key: "update-profile", type: "error", message: err instanceof Error ? err.message : "Failed to update profile" });
        },
      },
    );
  };

  // Change phone handlers
  const handleSendPhoneOtp = (phone: string, onSuccess: () => void) => {
    sendOtp({ mobileNumber: phone }, { onSuccess });
  };

  const handleVerifyPhoneOtp = (phone: string, otp: string, onSuccess: () => void) => {
    verifyOtp(
      { mobileNumber: phone, otp },
      {
        onSuccess: async () => {
          await supabase.auth.refreshSession();
          queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
          onSuccess();
        },
      },
    );
  };

  const closeChangePhoneModal = () => {
    setChangePhoneOpen(false);
    resetSendOtp();
    resetVerifyOtp();
  };

  // Change email handlers
  const handleSendChangeEmail = (email: string, onSuccess: () => void) => {
    sendChangeEmail({ newEmail: email }, { onSuccess });
  };

  const closeChangeEmailModal = () => {
    setChangeEmailOpen(false);
    resetChangeEmail();
  };

  const userInitials = (profile?.name ?? "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) return <LoadingSpinner message="Fetching your profile" />;

  return (
    <div className="pt-24 pb-10 px-6 md:px-10 max-w-(--container-max-w) mx-auto flex justify-center">
      <AuthCard className="max-w-md gap-6">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-surface-highest flex items-center justify-center text-headline-sm text-primary font-bold">
            {userInitials || <CircleUser className="w-8 h-8 text-text-muted" />}
          </div>
          <div className="text-center">
            <p className="text-headline-sm text-text">{profile?.name}</p>
            <p className="text-body-sm text-text-muted">{profile?.email}</p>
          </div>
        </div>

        {/* Email verification banner */}
        {profile && !profile.emailVerified && (
          <EmailVerificationBanner
            email={profile.email ?? ""}
            onResend={(onSuccess) =>
              sendEmailVerification(undefined, {
                onSuccess: () => {
                  setEmailVerifSent(true);
                  onSuccess();
                },
              })
            }
            isSending={isSendingVerif}
            error={sendVerifError}
            sent={emailVerifSent}
            onEditEmail={() => setChangeEmailOpen(true)}
          />
        )}

        {/* Tab nav */}
        <div className="w-full flex border-b border-outline -mb-2">
          {(["info", "documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-body-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-text-muted border-transparent hover:text-text"
              }`}
            >
              {tab === "info" ? "Personal Info" : "Documents"}
            </button>
          ))}
        </div>

        {/* Tab: Personal Info */}
        {activeTab === "info" && (
          <div className="w-full flex flex-col gap-4">
            <FormField
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={LIMITS.fullNameMax}
              errorMessage={errors.name}
            />

            {/* Email */}
            <div className="flex flex-col gap-1">
              <FormField
                id="email"
                label="Email"
                type="email"
                value={profile?.email ?? ""}
                disabled
              />
              <div className="flex items-center gap-3">
                {profile?.emailVerified ? (
                  <span className="flex items-center gap-1 text-label-sm text-primary">
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </span>
                ) : (
                  <span className="text-label-sm text-warning">Unverified</span>
                )}
                <button
                  onClick={() => setChangeEmailOpen(true)}
                  className="text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1">
              <FormField
                id="mobile"
                label="Mobile Number"
                placeholder="+91 1234567890"
                value={profile?.mobileNumber ?? ""}
                disabled
              />
              <div className="flex items-center gap-3">
                {profile?.phoneVerified && (
                  <span className="flex items-center gap-1 text-label-sm text-primary">
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </span>
                )}
                <button
                  onClick={() => setChangePhoneOpen(true)}
                  className="text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            <FormField
              id="dob"
              label="Date of birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              errorMessage={errors.dateOfBirth}
            />
            <FormField
              id="nationality"
              label="Nationality"
              placeholder="e.g. American"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              maxLength={LIMITS.nationalityMax}
              errorMessage={errors.nationality}
            />
            <FormField
              id="countryOfResidence"
              label="Country of residence"
              placeholder="e.g. India"
              value={countryOfResidence}
              onChange={(e) => setCountryOfResidence(e.target.value)}
              maxLength={LIMITS.nationalityMax}
              errorMessage={errors.countryOfResidence}
            />
            <FormField
              id="profession"
              label="Profession"
              placeholder="e.g. Software Engineer"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              maxLength={LIMITS.professionMax}
              errorMessage={errors.profession}
            />
            {isDirty && (
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                loading={isPending}
                className="w-full"
              >
                Save changes
              </Button>
            )}
          </div>
        )}

        {/* Tab: Documents */}
        {activeTab === "documents" && (
          <div className="w-full flex flex-col gap-4">
            {(["pan", "passport"] as DocumentType[]).map((type) => (
              <DocumentUpload
                key={type}
                type={type}
                label={DOCUMENT_LABELS[type]}
                existingDocument={docMap[type]}
                onUpload={handleUpload}
                onView={setViewDoc}
                isUploading={isUploading && uploadingVars?.type === type}
              />
            ))}
          </div>
        )}

        <div className="w-full h-px bg-outline" />

        <Button
          variant="error"
          size="md"
          onClick={() =>
            signOut()
          }
          className="w-full"
        >
          Logout
        </Button>
      </AuthCard>

      <DocumentViewerDialog
        isOpen={!!viewDoc}
        onClose={() => setViewDoc(null)}
        document={viewDoc}
        label={viewDoc ? DOCUMENT_LABELS[viewDoc.type] : ""}
      />

      <ChangeEmailDialog
        isOpen={changeEmailOpen}
        onClose={closeChangeEmailModal}
        currentEmail={profile?.email ?? ""}
        onSend={handleSendChangeEmail}
        isSending={isSendingChangeEmail}
        error={sendChangeEmailError}
      />

      <ChangePhoneDialog
        isOpen={changePhoneOpen}
        onClose={closeChangePhoneModal}
        currentPhone={profile?.mobileNumber ?? ""}
        onSendOtp={handleSendPhoneOtp}
        onVerifyOtp={handleVerifyPhoneOtp}
        isSendingOtp={isSendingPhoneOtp}
        isVerifying={isVerifyingPhone}
        sendOtpError={sendPhoneError}
        verifyError={verifyPhoneError}
      />
    </div>
  );
}
