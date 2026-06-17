export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <main style={{ padding: 24 }}>
      <h1>Recherche</h1>

      {/* ✅ Sécurisé : React échappe automatiquement la variable {q} contre le XSS */}
      <p>Résultats pour : {q}</p>
    </main>
  );
}
