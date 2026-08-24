import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";

let LAST_UPDATED: number | null = null;
const TOKEN_PRICE_REFRESH = 60 * 1000
let prices: {[key: string]: {
    usdPrice: string
}} = {};


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