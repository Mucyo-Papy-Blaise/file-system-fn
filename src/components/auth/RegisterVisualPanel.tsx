const highlights = [
  "Two-step onboarding with a clear progress path",
  "Separate organization setup from admin credentials",
  "Responsive layout optimized for desktop and mobile",
];

export function RegisterVisualPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top,_#2952cc_0%,_#11204f_42%,_#081126_100%)] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-12 right-0 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />

      <div className="relative space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-sky-300" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            Secure Onboarding
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="max-w-sm text-3xl font-semibold leading-tight">
            Create your workspace with a cleaner, faster registration flow.
          </h2>
          <p className="max-w-md text-sm leading-7 text-white/75">
            Keep the setup focused: define the organization first, then create the
            administrator account that will manage the workspace.
          </p>
        </div>
      </div>

      <div className="relative space-y-4">
        {highlights.map((item, index) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              0{index + 1}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/90">{item}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
