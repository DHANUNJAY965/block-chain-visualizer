import { NextResponse } from 'next/server';
import { sha512 } from '@noble/hashes/sha512';
import { getPublicKey } from '@noble/ed25519';
import * as ed from '@noble/ed25519';


ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));


const numericToUint8Array = (numeric: string): Uint8Array => {
  const buffer = new ArrayBuffer(32);
  const view = new DataView(buffer);
  const bigInt = BigInt(numeric);
  for (let i = 0; i < 32; i++) {
    view.setUint8(31 - i, Number(bigInt >> BigInt(i * 8) & BigInt(255)));
  }
  return new Uint8Array(buffer);
};


const uint8ArrayToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

export async function POST(req: Request) {
  try {

    const { privateKey } = await req.json();

    
    const privateKeyBytes = numericToUint8Array(privateKey);

   
    const publicKey = await getPublicKey(privateKeyBytes);

    const publicKeyHex = uint8ArrayToHex(publicKey);

    return NextResponse.json({ publicKey: publicKeyHex });
  } catch (error) {
    console.error('Error generating public key:', error);
    return NextResponse.json({ error: 'Error generating public key' }, { status: 500 });
  }
}
