import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/sqldb";
import { loginSchema } from "@/lib/validation";
import { signSession } from "@/lib/session"; // 🛡️ Import de notre utilitaire

export const runtime = "nodejs";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const maintenant = Date.now();

  const clientLimit = rateLimitMap.get(ip);
  if (clientLimit && maintenant < clientLimit.resetTime) {
    if (clientLimit.count >= 5) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
    }
    clientLimit.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: maintenant + 60000 });
  }

  const body = await req.json().catch(() => null);

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const db = getDb();

  const rows = db("SELECT * FROM users WHERE email = ?", [email]) as Array<unknown>;;
  const user = rows[0];

  const motDePasseOk = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !motDePasseOk) {
    return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 401 });
  }

  const res = NextResponse.json({
    message: "Connecté",
    user: { id: user.id, email: user.email, role: user.role },
  });

  // 🛡️ Génération d'un token signé à la place de l'ID brut (Correctif 5 amélioré)
  const sessionToken = signSession(user.id);

  res.cookies.set("vulnshop_session", sessionToken, {
    httpOnly: true,
    secure: false, // false pour le développement local HTTP
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2
  });

  return res;
}
