import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { apiKey } = body;

        // Ensure we check at runtime
        const SERVER_API_KEY = process.env.API_KEY || 'default_dev_key';

        if (apiKey === SERVER_API_KEY) {
            const cookieStore = await cookies();

            // Generate a secure hash of the API key as the session token
            const secureToken = crypto
                .createHash('sha256')
                .update(SERVER_API_KEY + 'oliverslife-salt')
                .digest('hex');

            console.log('Authentication successful');

            cookieStore.set('auth_token', secureToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' && !request.url.startsWith('http://'),
                sameSite: 'strict',
                // session cookie (no maxAge)
                path: '/',
            });

            return NextResponse.json({ success: true });
        } else {
            console.log('Authentication failed: Invalid key');
            return NextResponse.json({ success: false, message: 'Invalid API Key' }, { status: 401 });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
