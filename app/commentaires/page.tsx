import { comments } from "@/lib/db";

export default function CommentairesPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Commentaires</h1>

      {comments.map((c) => (
        <div key={c.id} style={{ marginBottom: 12 }}>
          <b>{c.author} :</b>{" "}
          {/* ✅ Sécurisé : Le contenu est affiché comme du texte brut échappé */}
          <span>{c.html}</span>
        </div>
      ))}
    </main>
  );
}
