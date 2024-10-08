import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bs58 from 'bs58'; 


export async function POST(req: Request) {
    try {
        const { input, encoding,mine } = await req.json(); 
        console.log(mine);
        console.log("Received request:", { input, encoding, mine });

      if(!mine || mine==undefined){
        
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

        console.log("the hash value is ",hashValue);

        return NextResponse.json({ hash: hashValue }, { status: 200 });

      }
      else{
        if (!input || !encoding) {
            return NextResponse.json({ error: 'Invalid input or encoding' }, { status: 400 });
        }
        
        let nonce:number=0;
        let hased:string=""
        while(true){
          
            let data:string=input+nonce;
            let hash=crypto.createHash('sha256').update(data).digest('hex');
            if(hash.startsWith('0000')){
                return NextResponse.json({ hash: hash,nonce },{ status: 200 })
            }
            nonce+=1;
            if (nonce > 1000000) { 
                return NextResponse.json({ error: 'Nonce limit exceeded' }, { status: 400 });
            }
        }
        
      }

    } catch (error) {
        console.error('Hash generation failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
