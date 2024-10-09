
import { NextResponse } from 'next/server';
import { generateKeyPairSync } from 'crypto';


const keyPairs = new Map<string, string>();

export async function POST(request: Request) {
  const { publicKey } = await request.json();

  if (!publicKey) {
    return NextResponse.json({ error: 'Public key is required' }, { status: 400 });
  }

  
  if (keyPairs.has(publicKey)) {
    return NextResponse.json({ privateKey: keyPairs.get(publicKey) });
  }

 
  const { privateKey, publicKey: generatedPublicKey } = generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });


  keyPairs.set(generatedPublicKey, privateKey);


  return NextResponse.json({ privateKey });
}