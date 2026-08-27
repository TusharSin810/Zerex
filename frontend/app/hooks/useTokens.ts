import { useEffect, useState } from "react";
import { TokenDetails } from "../lib/tokens";
import axios from "axios";

export interface TokenWithbalance extends TokenDetails{
    balance : string;
    usdBalance : string;
}

export function useTokens (address : string){
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
        if(!address) {
            return;
        }
        fetchTokens();
        const interval = setInterval(() => {
            fetchTokens();
        },30_000_000);
        return () => {
            clearInterval(interval);
        }
    },[address]);

    return {
        loading, tokenBalances
    }

}