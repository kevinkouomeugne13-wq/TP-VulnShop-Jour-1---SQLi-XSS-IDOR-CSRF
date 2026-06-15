import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const rows = db(
    "SELECT * FROM orders WHERE id = ?",
    [Number(id)]
  );

  if (!rows.length) {
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    commande: rows[0],
  });
}
