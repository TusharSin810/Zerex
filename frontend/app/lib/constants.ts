import { Connection } from "@solana/web3.js"
import axios from "axios";

let LAST_UPDATED: number | null = null;
const TOKEN_PRICE_REFRESH = 60 * 1000
let prices: {[key: string]: {
    usdPrice: string
}} = {};

export const SUPPORTED_TOKENS :{
    name: string,
    mint: string,
    native: boolean
}[] = [{
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false
},{
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false
},{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true
}]

const ids = SUPPORTED_TOKENS.map((token) => token.mint).join(',')

export const connection = new Connection("https://api.devnet.solana.com")

export async function getSupportedTokens(){
    if(!LAST_UPDATED || new Date().getTime() - LAST_UPDATED >= TOKEN_PRICE_REFRESH){
        const response = await axios.get(`https://api.jup.ag/price/v3?ids=${ids}`)      
        prices = response.data;
        LAST_UPDATED = new Date().getTime();
    }
    return SUPPORTED_TOKENS.map(s => ({
        ...s,
        usdPrice: prices[s.mint].usdPrice
    }))
}

getSupportedTokens();