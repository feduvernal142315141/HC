import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">HC standalone</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Modulo de historia clinica aislado para refactorizacion.
      </p>
      <Link
        href="/historia-clinica"
        className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Ir a historia clinica
      </Link>
    </main>
  );
}
