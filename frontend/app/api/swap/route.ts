import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const data : {
        baseAssestMint: string;
        quoteAssestMint: string;
        qty: string;
        quote:string;
    } = await req.json();
}