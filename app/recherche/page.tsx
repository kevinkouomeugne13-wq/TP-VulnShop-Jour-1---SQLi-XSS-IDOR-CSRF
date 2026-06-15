export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <main style={{ padding: 24 }}>
      <h1>Recherche</h1>

      <p
        dangerouslySetInnerHTML={{
          __html: `Résultats pour : ${q}`,
        }}
      />
    </main>
  );
}
