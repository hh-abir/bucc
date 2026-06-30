import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-10 text-center">
      <h1 className="font-serif text-3xl">Under construction</h1>
      <p className="max-w-md text-sm text-muted-foreground">This portal area is being rebuilt for the new BUCC dashboard.</p>
      <Link href="/dashboard" className="text-sm font-medium underline underline-offset-4">
        Back to dashboard
      </Link>
    </div>
  );
}
