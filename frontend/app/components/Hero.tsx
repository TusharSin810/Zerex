"use client"
import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./Button";
import { useRouter } from "next/navigation";

export default function Hero(){

    const session = useSession();
    const router = useRouter();

    return(
        <div className="relative w-full h-min flex flex-col items-center gap-4 py-24">
            <div className="relative text-5xl font-semibold">
                Decentralized Trading, <span className="text-cyan-600">Reimagined</span>
            </div>
            <div className="text-2xl text-slate-400">
                Fast swaps, transparent liquidity, zero middlemen.
            </div>
            {session.data?.user?<SecondaryButton onClick={() =>{router.push("/dashboard")}}>
                Go To DashBoard
            </SecondaryButton>:<SecondaryButton onClick={() => {
                signIn("google");
            }}>SignUp With Google</SecondaryButton>
            }
        </div>
    )
}