import { NextRequest, NextResponse } from "next/server";

let profil = {
  email: "alice@vulnshop.test",
};

export async function GET() {
  return NextResponse.json(profil);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  profil.email = body.email;

  return NextResponse.json({
    success: true,
    profil,
  });
}
