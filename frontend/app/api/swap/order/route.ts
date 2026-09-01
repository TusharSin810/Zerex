import { NextResponse } from "next/server";

export async function POST(req: NextResponse){
    
    try{
        const{
            inputMint,
            outputMint,
            amount,
            taker
        } = await req.json();

        if(!inputMint || !outputMint || !amount || !taker){
            return NextResponse.json({
                error: "Missing Required Parameters"
            },{
                status: 401 
            });
        }
        const url = `https://api.jup.ag/swap/v2/order?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&taker=${taker}`
                
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json()
        return(
            NextResponse.json(data,{
                status: response.status
            })
        )
    }catch(e){
        console.error("Error Getting Quote and Order Transaction",e)
        return(
            NextResponse.json({
                error:"Failed to Fetch Quote and Creating Order"
            })
        )
    }
}