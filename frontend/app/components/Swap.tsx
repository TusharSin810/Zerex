"use client"
import { useState } from "react"
import { SUPPORTED_TOKENS , TokenDetails} from "../lib/tokens"
import { TokenWithbalance } from "../hooks/useTokens";

export function Swap({tokens}:{
    tokens: TokenWithbalance[];
}){

    const [baseAssest, setBaseAssest] = useState(SUPPORTED_TOKENS[0])
    const [quoteAssest, setQuoteAssest] = useState(SUPPORTED_TOKENS[1])
    const baseBalance = tokens.find((token) => token.name === baseAssest.name)?.balance ?? "0";
    const quoteBalance = tokens.find((token) => token.name === quoteAssest.name)?.balance ?? "0";

    return(
        <div className="p-2 bg-gray-200 rounded-xl flex flex-col gap-1">
            <h1 className="text-xl font-bold">Swap Tokens</h1>
            <div className="flex flex-col">
                <SwapInputRow onSelect={(assest) => {
                    setBaseAssest(assest)
                }} selectedToken={baseAssest} baseBalance={baseBalance}/>
                <SwapOutputRow onSelect={(assest) => {
                    setQuoteAssest(assest)
                }} selectedToken={quoteAssest} quoteBalance={quoteBalance}/>
                
            </div>
        </div>
    )
}

function SwapInputRow({onSelect, selectedToken, baseBalance}:{
    onSelect: (assest: TokenDetails) => void;
    selectedToken : TokenDetails;
    baseBalance: string;
}){
    return(
        <div className="border border-b-0 flex justify-between p-2 rounded-t-2xl border-gray-400">
            <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold">You Pay:</label>
                <AssestSelector selectedToken={selectedToken} onSelect={onSelect}/>
                <small className="text-gray-600">Current Balance: {baseBalance} {selectedToken.name}</small>
            </div>
        </div>
    )
}

function SwapOutputRow({onSelect, selectedToken, quoteBalance}:{
    onSelect: (assest: TokenDetails) => void;
    selectedToken : TokenDetails;
    quoteBalance: string;
}){
    return(
        <div className="border flex justify-between rounded-b-2xl p-2 border-gray-400">
            <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold">You Receive:</label>
                <AssestSelector selectedToken={selectedToken} onSelect={onSelect}/>
                <small className="text-gray-600">Current Balance: {quoteBalance} {selectedToken.name}</small>
            </div>
        </div>
    )
}


function AssestSelector({selectedToken, onSelect}:{
    selectedToken: TokenDetails;
    onSelect: (asset: TokenDetails) => void;
}){
    return(
        <div>
            <select onChange={(e) => {
                const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
                if(selectedToken){
                    onSelect(selectedToken);
                }
            }} id="countries" className="block w-full px-3 py-2.5 bg-gray-200 rounded-2xl border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body cursor-pointer">
                {SUPPORTED_TOKENS.map(token => <option>
                    {token.name}
                </option>)}
            </select>
        </div>
    )
}
