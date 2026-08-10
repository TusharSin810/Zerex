import { getServerSession } from "next-auth";
import ProfileCard from "../components/ProfileCard";
import prismaClient from "../db";
import { authConfig } from "../lib/auth";

async function getUserWallet(){
    const session = await getServerSession(authConfig);
    const userWallet = await prismaClient.solWallet.findFirst({
        where: {
            userId: session?.user.uid 
        },
        select:{
            publicKey: true
        }
    })
    return userWallet;
}

export default async function DashBoard(){
    const userWallet = await getUserWallet();
    if(!userWallet){
        return("Solana Wallet Does Not Exist For The User")
    }
    return(
        <div className="flex flex-1 items-center justify-center">
            <ProfileCard pubKey={userWallet?.publicKey}/>
        </div>
    )
}