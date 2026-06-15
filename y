import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // En secure coding, on compare de manière stricte (ou via requêtes préparées)
        if (email === "admin@vulnshop.test" && password === "admin") {
            return NextResponse.json({ 
                success: true, 
                message: "Authentification sécurisée réussie !", 
                token: "session_secure_token_abc123" 
            });
        }

        return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
