"use client"
import { useEffect, useState } from "react"
import { SUPPORTED_TOKENS , TokenDetails} from "../lib/tokens"
import { TokenWithbalance } from "../hooks/useTokens";
import { PrimaryButton, SecondaryButton } from "./Button";
import axios from "axios";
import { Loader } from "./loader";

export function Swap({tokens, setActive, pubKey}:{
    tokens: TokenWithbalance[];
    setActive: any;
    pubKey : string
}){

    const [baseAssest, setBaseAssest] = useState(SUPPORTED_TOKENS[0])
    const [quoteAssest, setQuoteAssest] = useState(SUPPORTED_TOKENS[1])
    const [baseAmount, setBaseAmount] = useState<string>();
    const [quoteAmount, setQuoteAmount] = useState<string>();
    const baseBalance = tokens.find((token) => token.name === baseAssest.name)?.balance ?? "0";
    const quoteBalance = tokens.find((token) => token.name === quoteAssest.name)?.balance ?? "0";
    const [loading, setLoading] = useState(true);
    const [requestId, setRequestId] = useState<string>();

    useEffect(() => {
        if(!baseAmount || Number(baseAmount) <= 0){
            setQuoteAmount("0");
            setLoading(false);
            return;
        }
        if(baseAssest.mint === quoteAssest.mint){
            setQuoteAmount(baseAmount);
            setLoading(false);
            return;
        }
        const getQuote = async() => {
            setLoading(true);
            try{
                const amount = Number(baseAmount) * (10 ** baseAssest.decimals);
                const response = await axios.post("/api/swap/order",{
                    inputMint: baseAssest.mint,
                    outputMint: quoteAssest.mint,
                    amount: amount,
                    taker: pubKey
                })
                    .then(res => {
                        setQuoteAmount(String(res.data.outAmount / (10 ** quoteAssest.decimals)))
                        setLoading(false);
                        setRequestId(res.data.requestId)
                    })  
            }catch(e){
                console.log(e);
                setLoading(false);
            };
        }    
        getQuote();
        const interval = setInterval(() => {
            getQuote();
        },3_00_000)
        return () => {
            clearInterval(interval);
        }
    },[baseAssest, quoteAssest, baseAmount])


    return(
        <div className="p-2 bg-gray-100 shadow-lg rounded-xl flex flex-col gap-1">
            <h1 className="text-xl font-bold">Swap Tokens</h1>
            <div className="flex flex-col">
                <SwapInputRow 
                    onSelect={(assest) => {
                        setBaseAssest(assest)
                    }} 
                    selectedToken={baseAssest} 
                    baseBalance={baseBalance}
                    onAmountChange={(value: string) => {
                        setBaseAmount(value);
                    }}
                />
                <div className="flex justify-center items-center">
                    <div onClick={() => {
                        let baseAssestTemp = baseAssest;
                        setBaseAssest(quoteAssest);
                        setQuoteAssest(baseAssestTemp);
                    }} className="cursor-pointer rounded-full w-10 h-10 border border-gray-300 bg-white absolute flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-600">⇅</div>
                </div>
                <SwapOutputRow 
                    onSelect={(assest) => {
                        setQuoteAssest(assest)
                    }} 
                    selectedToken={quoteAssest} 
                    quoteBalance={quoteBalance}
                    amount={quoteAmount}
                    loading={loading}
                />
                <div className="flex justify-center mt-1">
                    {Number(baseBalance) < Number(baseAmount) 
                    ? 
                    (<SecondaryButton onClick={() => {setActive("addFunds")}}>Insufficient Balance</SecondaryButton>)
                    :
                    (<PrimaryButton onClick={() => {axios.post("api/swap",{requestId})}}>Swap</PrimaryButton>)}
                </div>
            </div>
        </div>
    )
}

function SwapInputRow({onSelect, onAmountChange, selectedToken, baseBalance}:{
    onSelect: (assest: TokenDetails) => void;
    onAmountChange: (value: string) => void;
    selectedToken : TokenDetails;
    baseBalance: string;
    }){
    return(
        <div className="border border-b-0 flex justify-between p-2 rounded-t-2xl border-gray-300 bg-white items-center">
            <div className="flex flex-col gap-0.5 w-max">
                <label className="text-xs font-semibold">You Pay:</label>
                <div className="w-fit">
                    <AssestSelector selectedToken={selectedToken} onSelect={onSelect}/>
                </div>
                <small className="text-gray-600">Current Balance: {baseBalance} {selectedToken.name}</small>
            </div>
            <div>
                <input onChange={(e) => {
                    onAmountChange(e.target.value);
                }} className="text-4xl p-2 border-0 outline-0" dir="rtl" placeholder="0"></input>
            </div>
        </div>
    )
}

function SwapOutputRow({onSelect, selectedToken, quoteBalance,amount,loading}:{
    onSelect: (assest: TokenDetails) => void;
    selectedToken : TokenDetails;
    quoteBalance: string;
    amount?: string;
    loading: boolean;
}){
    return(
        <div className="border flex justify-between rounded-b-2xl p-2 border-gray-300 bg-white">
            <div className="flex flex-col gap-0.5 w-max">
                <label className="text-xs font-semibold">You Receive:</label>
                <div className="w-fit">
                    <AssestSelector selectedToken={selectedToken} onSelect={onSelect}/>
                </div>
                <small className="text-gray-600">Current Balance: {quoteBalance} {selectedToken.name}</small>
            </div>
            <div className={`flex justify-center items-center p-2 text-4xl ${
                Number(amount) > 0 ? "text-black" : "text-gray-500"
            }`}>
                {loading ? (<Loader />) : Number(amount) > 0 ? (Number(amount).toPrecision(4)) : ("0")}
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
            <select value={selectedToken.name} onChange={(e) => {
                const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
                if(selectedToken){
                    onSelect(selectedToken);
                }
            }} className="w-fit px-3 py-2.5 bg-gray-300 rounded-2xl text-sm focus:ring-brand focus:border-brand shadow-xs cursor-pointer">
                {SUPPORTED_TOKENS.map(token => <option key={token.name} value={token.name}>{token.name}</option>)}
            </select>
        </div>
    )
}
