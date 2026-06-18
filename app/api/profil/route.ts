import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";
import { verifySession } from "@/lib/session"; // 🛡️ Import de notre décodeur sécurisé

export const runtime = "nodejs";

// ==========================================
// 1. RÉCUPÉRATION DU PROFIL (GET)
// ==========================================
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("vulnshop_session");

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json(
      { error: "Accès non autorisé. Veuillez vous connecter." },
      { status: 401 }
    );
  }

  // 🛡️ Décodage et vérification de la signature cryptographique du cookie
  const userId = verifySession(sessionCookie.value);

  if (!userId) {
    return NextResponse.json(
      { error: "Session invalide ou falsifiée." },
      { status: 401 }
    );
  }

  const db = getDb();
  const rows = db("SELECT id, email, role FROM users WHERE id = ?", [userId]) as Array<unknown>;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: rows[0].id, email: rows[0].email, role: rows[0].role },
  });
}

// ==========================================
// 2. MODIFICATION DU PROFIL (POST) + ANTI-CSRF
// ==========================================
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (origin && !origin.includes(host || "")) {
    return NextResponse.json(
      { error: "Échec de la vérification de sécurité (CSRF détecté)" },
      { status: 403 }
    );
  }

  const sessionCookie = req.cookies.get("vulnshop_session");
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  // 🛡️ Décodage et vérification de la signature cryptographique du cookie ici aussi
  const userId = verifySession(sessionCookie.value);

  if (!userId) {
    return NextResponse.json(
      { error: "Session invalide ou falsifiée." },
      { status: 401 }
    );
  }

  const db = getDb();

  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    db("UPDATE users SET email = ? WHERE id = ?", [email, userId]);

    return NextResponse.json({ message: "Profil mis à jour avec succès !", newEmail: email });

  } catch (err) {
    console.error("❌ Erreur dans POST /api/profil :", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
