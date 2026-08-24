import { TokenWithbalance } from "../hooks/useTokens";

export function TokenList({tokens}:{
    tokens: TokenWithbalance[]
}){
    return (
        <div className="flex flex-col bg-gray-200 p-4 rounded-md">
            {tokens.map(t => <TokenRow key={t.mint} token={t} />)}
        </div>
    )
}

function TokenRow({token}:{
    token: TokenWithbalance
}){
    return(
        <div className="flex justify-between p-1">
            <div className="flex gap-1">
                <img src={token.image} className="h-8 rounded-full w-8"></img>
                <div className="flex flex-col">
                    <span className="font-semibold">{token.name}</span>
                    <span className="text-xs text-gray-500">1 {token.name} = ${Number(token.usdPrice).toPrecision(4)}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="font-semibold">$ {Number(token.usdBalance).toPrecision(4)}</span>
                <span className="text-xs text-gray-500">{token.balance} {token.name}</span>
            </div>
        </div>
    )
}