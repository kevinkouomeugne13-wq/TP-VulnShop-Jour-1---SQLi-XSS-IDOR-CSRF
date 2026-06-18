import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";
import { verifySession } from "@/lib/session"; // 🛡️ Import de notre vérificateur de session

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = req.cookies.get("vulnshop_session");
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  // 🛡️ Décodage cryptographique et validation de l'ID utilisateur
  const userId = verifySession(sessionCookie.value);

  if (!userId) {
    return NextResponse.json(
      { error: "Session invalide ou falsifiée." },
      { status: 401 }
    );
  }

  const db = getDb();

  // Initialisation de la table avec types SQL standards (Fixtures)
  try {
    db("CREATE TABLE IF NOT EXISTS commandes (id INT, user_id INT, produit VARCHAR(255), prix FLOAT)");

   const check = db("SELECT * FROM commandes") as Array<unknown>;
    if (!check || check.length === 0) {
      db("INSERT INTO commandes VALUES (1, 1, 'Clavier Mecanique Cyber', 89.99)");
      db("INSERT INTO commandes VALUES (2, 2, 'Souris de Bob', 45.00)");
    }
  } catch (e) {
    console.error("⚠️ Échec init table commandes :", e);
  }

  try {
    const { id } = await params;
    const commandeId = Number(id);

    // 🛡️ Requête paramétrée : Protection Injection SQL + Double barrière IDOR
    const commandes = db(
      "SELECT * FROM commandes WHERE id = $commandeId AND user_id = $userId",
      { commandeId, userId }
    ) as Array<unknown>;

    if (!commandes || commandes.length === 0) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ commande: commandes[0] });

  } catch (err) {
    console.error("❌ Erreur finale dans /api/commandes :", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
