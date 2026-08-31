import { getServerSession } from "next-auth";
import ProfileCard from "../components/ProfileCard";
import prismaClient from "../db";
import { authConfig } from "../lib/auth";
import { SecondaryButton } from "../components/Button";
import { redirect } from "next/dist/server/api-utils";

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
        return(
                <div className="flex items-center justify-center w-full text-2xl font-semibold">
                    Solana Account Does Not Exist For the User Please Login To Create One
                </div>
        )
    }
    return(
        <div className="flex flex-1 items-center justify-center">
            <ProfileCard pubKey={userWallet?.publicKey}/>
        </div>
    )
}