import crypto from "crypto";

const SECRET_KEY = process.env.SESSION_SECRET || "une_cle_secrete_temporaire_de_dev_32_caracteres_minimum";
/**
 * Signe un identifiant utilisateur pour créer un token sécurisé
 */
export function signSession(userId: number): string {
  const value = String(userId);
  const hmac = crypto.createHmac("sha256", SECRET_KEY).update(value).digest("hex");
  return `${value}.${hmac}`;
}

/**
 * Vérifie un token et retourne l'ID de l'utilisateur s'il est valide, sinon null
 */
export function verifySession(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [value, signature] = parts;
  
  // Recalcul du HMAC pour vérifier l'intégrité
  const expectedHmac = crypto.createHmac("sha256", SECRET_KEY).update(value).digest("hex");
  
  // Utilisation de timingSafeEqual pour éviter les attaques temporelles (Timing Attacks)
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedHmac);
  
  if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
    return Number(value);
  }
  
  return null;
}
