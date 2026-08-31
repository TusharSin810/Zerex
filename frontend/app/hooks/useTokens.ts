import { useEffect, useState } from "react";
import { TokenDetails } from "../lib/tokens";
import axios from "axios";

export interface TokenWithbalance extends TokenDetails{
    balance : string;
    usdBalance : string;
}

export function useTokens (
    address : string, 
    active :"send" | "addFunds" | "withdraw" | "swap" | "token"
){
    const [tokenBalances, setTokenBalances] = useState<{
        totalBalance: number,
        tokens: TokenWithbalance[]
    } | null >(null);

    const [loading, setLoading] = useState(true);

    const fetchTokens = async() => {
            setLoading(true);
            const res = await axios.get(`/api/tokens?address=${address}`)
            .then(res => {
                setTokenBalances(res.data);
            })
            .catch((e) => {
                console.log("Failed To Fetch Tokens",e)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if(!address || active !== "token") {
            return;
        }
        setTimeout(()=>{fetchTokens()},5000);
        const interval = setInterval(() => {
            fetchTokens();
        },300_000);
        return () => {
            clearInterval(interval);
        }
    },[address,active]);

    return {
        loading, tokenBalances
    }

}