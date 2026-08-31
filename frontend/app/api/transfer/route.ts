import prismaClient from "@/app/db";
import { authConfig, session } from "@/app/lib/auth";
import { connection } from "@/app/lib/constants";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress} from "@solana/spl-token";
import { Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const NATIVE_SOL_MINT =
    "So11111111111111111111111111111111111111112";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.uid) {
            return NextResponse.json(
                { error: "Unauthorized to send funds" },
                { status: 401 }
            );
        }

        const {
            recipient,
            amount,
            mint,
            decimals,
        } = await request.json();

        if (!recipient || !amount || !mint) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let recipientPublicKey: PublicKey;

        try {
            recipientPublicKey = new PublicKey(recipient);
        } catch {
            return NextResponse.json(
                { error: "Invalid recipient address" },
                { status: 400 }
            );
        }

        const keyPair = await getKeypair(session);

        if (!keyPair) {
            return NextResponse.json(
                { error: "Wallet not found" },
                { status: 404 }
            );
        }

        const amountNumber = Number(amount);

        if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        if (mint === NATIVE_SOL_MINT) {
            const result = await SolTransfer(
                amountNumber,
                keyPair,
                recipientPublicKey
            );

            return NextResponse.json(
                result,
                {
                    status: result.success ? 200 : result.status,
                }
            );
        }

        if (!Number.isInteger(decimals) || decimals < 0) {
            return NextResponse.json(
                { error: "Invalid token decimals" },
                { status: 400 }
            );
        }

        const mintPublicKey = new PublicKey(mint);

        const tokenAmount = BigInt(
            Math.floor(
                amountNumber * 10 ** decimals
            )
        );

        if (tokenAmount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        const sourceAta = await getAssociatedTokenAddress(
            mintPublicKey,
            keyPair.publicKey
        );

        const sourceAccountInfo =
            await connection.getAccountInfo(sourceAta);

        if (!sourceAccountInfo) {
            return NextResponse.json(
                { error: "You don't have an account for this token" },
                { status: 400 }
            );
        }

        const destinationAta =
            await getAssociatedTokenAddress(
                mintPublicKey,
                recipientPublicKey
            );

        const destinationAccountInfo =
            await connection.getAccountInfo(destinationAta);

        const transaction = new Transaction();

        if (!destinationAccountInfo) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    keyPair.publicKey,
                    destinationAta,
                    recipientPublicKey,
                    mintPublicKey
                )
            );
        }

        transaction.add(
            createTransferInstruction(
                sourceAta,
                destinationAta,
                keyPair.publicKey,
                tokenAmount
            )
        );

        const signature =
            await sendAndConfirmTransaction(
                connection,
                transaction,
                [keyPair]
            );

        return NextResponse.json({
            success: true,
            signature,
        });

    } catch (error) {
        console.error("Transfer Error:", error);

        return NextResponse.json(
            {
                error: "Transfer failed",
            },
            {
                status: 500,
            }
        );
    }
}

async function getKeypair(session: session):Promise<Keypair | null>{
    const wallet = await prismaClient.solWallet.findFirst({
        where:{
            userId: session.user.uid
        }
    });
    if(!wallet){
        return null
    }
    const key = wallet.privateKey.split(",").map(x => Number(x))
    const secretKey = Uint8Array.from(key);

    const keyPair = Keypair.fromSecretKey(secretKey);
    return(
        keyPair
    )
}

async function SolTransfer(amount : number, keyPair: Keypair, recipientPublicKey: PublicKey){

    const amountNo = Number(amount);

    if (!Number.isFinite(amountNo) || amountNo <= 0) {
        return ({
            success: false,
            error: "Invalid amount",
            status: 400 
        });
    }

    const lamports = Math.floor(
        amountNo * 1_000_000_000
    );

    const balance = await connection.getBalance(keyPair.publicKey);

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: keyPair.publicKey,
            toPubkey: recipientPublicKey,
            lamports,
        })
    );

    transaction.feePayer = keyPair.publicKey;
    const {blockhash} = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;

    const feeRes = await connection.getFeeForMessage(
        transaction.compileMessage(),
        "confirmed"
    );

    const fee = feeRes.value ?? 0;
     
    if (balance < lamports + fee) {
        return{
                error: "Insufficient SOL balance",
                balance,
                amount: lamports,
                fee,
                required: lamports + fee,
                status: 400 
        };
    }

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keyPair]
    )
    return {
        success : true,
        signature,
    }
}