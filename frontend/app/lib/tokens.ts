export interface TokenDetails {
    name: string,
    mint: string,
    native: boolean,
    image: string,
    usdPrice: string,
    decimals: number
}

export const SUPPORTED_TOKENS : TokenDetails[] = [{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo0RncRnhoeocDjzovocLm_2ZNjfYxCukKhNBfNjyzMQ&s=10",
    usdPrice:"1",
    decimals: 9
},{
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtHNZOGO_mP6LPo_KC7GPePIDOTu5pX8JxvV0zk5uhMw&s=10",
    usdPrice: "1",
    decimals: 6
},{
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPA5NPWXgthi_UEOvvB2b6CCbMa_p71JCmMoglEdr2dw&s=10",
    usdPrice: "1",
    decimals: 6
}]
