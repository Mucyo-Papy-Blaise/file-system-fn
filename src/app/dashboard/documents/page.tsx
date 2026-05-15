const documents = [
  { name: "Board Resolution.pdf", category: "Legal" },
  { name: "Quarterly Report.xlsx", category: "Finance" },
  { name: "Employee Handbook.docx", category: "HR" },
];

export default function DashboardDocumentsPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-secondary)] text-secondary">
            <tr>
              <th className="px-5 py-4 font-medium">Document</th>
              <th className="px-5 py-4 font-medium">Category</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.name} className="border-t border-default">
                <td className="px-5 py-4 text-foreground">{document.name}</td>
                <td className="px-5 py-4 text-secondary">{document.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
