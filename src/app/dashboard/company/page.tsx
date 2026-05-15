export default function DashboardCompanyPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Company Settings</h1>
        <p className="text-sm text-secondary">Update organization profile and administrative preferences.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface p-5">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <p className="mt-2 text-sm text-secondary">Company name, logo, and branding settings go here.</p>
        </article>
        <article className="surface p-5">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="mt-2 text-sm text-secondary">Password policy, sessions, and access controls.</p>
        </article>
      </section>
    </div>
  );
}
