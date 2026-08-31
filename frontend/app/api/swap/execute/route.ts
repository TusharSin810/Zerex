import prismaClient from "@/app/db";
import { authConfig } from "@/app/lib/auth";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const data : {
        order:{
            requestId: string;
            transaction: string;
            lastValidBlockHeight: string;
        }
    } = await req.json();

    if(data.order.transaction === ""){
        return(NextResponse.json({
            message:"Transaction Object Not Created"
        }))
    }

    const session = await getServerSession(authConfig);
    if(!session?.user){
        return(
            NextResponse.json({
                message:"You Are Not Logged in"
            },{
                status: 401
            })
        )
    }

    if(!data.order.requestId){
        return NextResponse.json({
            message: "Error Fetching Quote From Chain"
        })
    }

    const solWallet = await prismaClient.solWallet.findFirst({
        where:{
            userId: session.user.uid
        }
    })
    if(!solWallet){
        return(
            NextResponse.json({
                message: "Error in Creating Users SolWallet"
            })
        )
    }

    const transactionBuf = Buffer.from(data.order.transaction, 'base64');
    var transaction = VersionedTransaction.deserialize(transactionBuf);
    const privateKey = getPrivateKey(solWallet.privateKey);
    const signedTransaction = transaction.sign([privateKey])

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        signedTransaction: signedTransaction,
        requestId: data.order.requestId,
        })
    };

    const response = await fetch('https://api.jup.ag/swap/v2/execute', options)

    const dataResponse = await response.json();
    return(
        NextResponse.json(dataResponse,{
            status: response.status
        })
    )
}

function getPrivateKey(privateKey: string){
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUint = Uint8Array.from(arr);
    const keyPair = Keypair.fromSecretKey(privateKeyUint);

    return keyPair;
}