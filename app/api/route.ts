import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bs58 from 'bs58'; 


export async function POST(req: Request) {
    try {
        const { input, encoding } = await req.json(); 

        if (!input || !encoding) {
            return NextResponse.json({ error: 'Invalid input or encoding' }, { status: 400 });
        }

        let hashValue = '';

        const hash = crypto.createHash('sha256').update(input);

        switch (encoding) {
            case 'Ascii':
                hashValue = hash.digest('ascii');
                break;
            case 'Hex':
                hashValue = hash.digest('hex');
                break;
            case 'Base64':
                hashValue = hash.digest('base64');
                break;
            case 'Base58':
                hashValue = bs58.encode(hash.digest());
                break;
            default:
                return NextResponse.json({ error: 'Unsupported encoding type' }, { status: 400 });
        }

        return NextResponse.json({ hash: hashValue }, { status: 200 });
    } catch (error) {
        console.error('Hash generation failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
