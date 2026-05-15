"use client";

import Link from "next/link";
import { AcceptInvitationStep } from "./AcceptInvitationStep";
import type { AcceptInvitationErrors, AcceptInvitationFormValues } from "@/types/accept-invitation.ts";

interface AcceptInvitationFormPanelProps {
  values: AcceptInvitationFormValues;
  errors: AcceptInvitationErrors;
  invitationEmail: string;
  isSubmitting: boolean;
  isValid: boolean;
  onUpdateValue: (key: keyof AcceptInvitationFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AcceptInvitationFormPanel({
  values,
  errors,
  invitationEmail,
  isSubmitting,
  isValid,
  onUpdateValue,
  onSubmit,
}: AcceptInvitationFormPanelProps) {
  return (
    <div
      className={[
        "relative z-10",
        "w-full lg:w-[68%] lg:min-w-[620px] lg:max-w-[760px]",
        "bg-surface",
        "lg:[box-shadow:20px_0_70px_rgba(0,0,0,0.12)]",
        "lg:[clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]",
        "flex flex-col justify-center",
        "px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12",
      ].join(" ")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 hidden h-72 w-72 rounded-full lg:block"
        style={{
          background:
            "radial-gradient(circle, rgba(74,180,120,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="mx-auto flex w-full max-w-sm flex-col justify-center lg:max-w-[360px]">
        <div
          className="mb-6 animate-[fadeUp_0.35s_ease_both]"
          style={{ animationDelay: "0.08s" }}
        >
          <h1 className="mb-2 font-light leading-[1.12] tracking-tight text-foreground">
            Join workspace
          </h1>
          <p className="text-[13px] text-muted">
            Complete your profile to get started
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div
            className="animate-[fadeUp_0.4s_ease_both]"
            style={{ animationDelay: "0.20s" }}
          >
            <AcceptInvitationStep
              values={values}
              errors={errors}
              invitationEmail={invitationEmail}
              onUpdateValue={onUpdateValue}
            />
          </div>

          <div
            className="animate-[fadeUp_0.4s_ease_both]"
            style={{ animationDelay: "0.30s" }}
          >
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={[
                "flex w-full items-center justify-center gap-2 rounded-[3px] py-3.5",
                "text-[11px] font-bold uppercase tracking-[0.14em]",
                "transition-all duration-200",
                isValid && !isSubmitting
                  ? "bg-primary text-primary-foreground hover:-translate-y-px hover:brightness-105 hover:shadow-lg"
                  : "bg-primary/20 text-gray-400 cursor-not-allowed",
              ].join(" ")}
            >
              {isSubmitting ? "Creating account..." : "Join workspace"}
            </button>
          </div>
        </form>

        <p
          className="mt-7 text-center text-[12px] text-muted animate-[fadeUp_0.4s_ease_both]"
          style={{ animationDelay: "0.40s" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary/85 no-underline transition-opacity hover:opacity-100"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}