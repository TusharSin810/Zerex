import { TokenWithbalance } from "../hooks/useTokens";

export function TokenList({tokens}:{
    tokens: TokenWithbalance[]
}){
    return (
        <div className="flex-col bg-gray-200 p-4 rounded-md">
            {tokens.map(t => <TokenRow token={t} />)}
        </div>
    )
}

function TokenRow({token}:{
    token: TokenWithbalance
}){
    return(
        <div className="flex justify-between">
            <div className="flex">
                <img src={token.image} className="h-8 rounded-full w-8"></img>
                <div className="flex flex-col">
                    <span>{token.name}</span>
                    <span>1 {token.name} = ${Number(token.usdPrice).toPrecision(4)}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span>${Number(token.usdBalance).toPrecision(4)}</span>
                <span>{token.balance} {token.name}</span>
            </div>
        </div>
    )
}