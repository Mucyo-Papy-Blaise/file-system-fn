"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/api/api-client";
import { AcceptInvitationFormPanel } from "@/components/auth/AcceptInvitationFormPanel";
import { VisualPanel } from "@/components/auth/Visualpanel";
import type { AcceptInvitationErrors, AcceptInvitationFormValues } from "@/types/accept-invitation.ts";
import { validateAcceptInvitationForm } from "@/types/schema/accept-invitation.schema";
import { useAcceptInvitation, useGetInvitationDetails } from "@/lib/hooks/useInvitations";

const defaultValues: AcceptInvitationFormValues = {
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { invitation, isLoading: isLoadingInvitation, error: invitationError } = useGetInvitationDetails(token);
  const acceptInvitation = useAcceptInvitation();

  const [values, setValues] = useState<AcceptInvitationFormValues>(defaultValues);
  const [errors, setErrors] = useState<AcceptInvitationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () => Object.keys(validateAcceptInvitationForm(values)).length === 0,
    [values],
  );

  const updateValue = (key: keyof AcceptInvitationFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateAcceptInvitationForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    if (!token) {
      toast.error("Invitation token is missing.");
      return;
    }

    try {
      setIsSubmitting(true);
      await acceptInvitation.mutateAsync({
        token,
        ...values,
      });

      toast.success("Account created, please login");
      router.replace("/login");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Unable to accept this invitation.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInvitation) {
    return (
      <main className="relative flex h-screen w-screen overflow-hidden bg-background">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted">Loading invitation...</p>
          </div>
        </div>
      </main>
    );
  }

  if (invitationError || !invitation) {
    return (
      <main className="relative flex h-screen w-screen overflow-hidden bg-background">
        <div className="flex h-full w-full items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="mb-4 text-2xl font-semibold text-foreground">Invalid Invitation</h1>
            <p className="text-muted mb-6">
              This invitation link is invalid or has expired. Please contact your administrator for a new invitation.
            </p>
            <a
              href="/login"
              className="inline-block rounded-[3px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Login
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <main className="relative flex h-screen w-screen overflow-hidden bg-background">
        <div className="absolute inset-0 hidden lg:block">
          <VisualPanel />
        </div>

        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 60% 10%, var(--color-primary-subtle) 0%, var(--color-bg-secondary) 60%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full overflow-y-auto lg:overflow-hidden">
          <AcceptInvitationFormPanel
            values={values}
            errors={errors}
            invitationEmail={invitation.email}
            isSubmitting={isSubmitting}
            isValid={isValid}
            onUpdateValue={updateValue}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  );
}
