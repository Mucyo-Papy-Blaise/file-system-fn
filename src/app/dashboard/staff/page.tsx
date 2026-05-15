const staffRows = [
  { name: "Alice Uwimana", role: "Manager", status: "Active" },
  { name: "Eric Niyonzima", role: "Supervisor", status: "Active" },
  { name: "Grace Irakoze", role: "Operator", status: "On Leave" },
];

export default function DashboardStaffPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
        <p className="text-sm text-secondary">Manage your team members and roles.</p>
      </header>

      <section className="surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-secondary)] text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {staffRows.map((row) => (
              <tr key={row.name} className="border-t border-default">
                <td className="px-4 py-3 text-foreground">{row.name}</td>
                <td className="px-4 py-3 text-secondary">{row.role}</td>
                <td className="px-4 py-3 text-secondary">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
