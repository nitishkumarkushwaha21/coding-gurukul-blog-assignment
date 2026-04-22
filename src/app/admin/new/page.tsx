import { AdminEditor } from "@/components/AdminEditor";

export default function AdminNewPage() {
  return (
    <section className="space-y-4" aria-label="Create blog page">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        Create blog
      </h1>
      <AdminEditor mode="create" />
    </section>
  );
}
