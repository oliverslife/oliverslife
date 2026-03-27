import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
