import { useEffect, useState } from "react";
import { TokenDetails } from "../lib/constants";
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

    useEffect(() => {
        axios.get(`/api/tokens?address=${address}`)
            .then(res => {
                setTokenBalances(res.data);
            })
            .catch((e) => {
                console.log("Failed To Fetch Tokens",e)
            })
            .finally(() => {
                setLoading(false);
            });
    },[address])

    return {
        loading, tokenBalances
    }

}