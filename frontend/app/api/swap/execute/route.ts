import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const data : {
        requestId: string;
        signedTransaction: string;
    } = await req.json();

    if(!data.requestId){
        return NextResponse.json({
            message: "Error Fetching Quote From Chain"
        })
    }

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        signedTransaction: '<string>',
        requestId: '<string>',
        lastValidBlockHeight: '<string>'
        })
    };

    fetch('https://api.jup.ag/swap/v2/execute', options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));


}
