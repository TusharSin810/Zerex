"use client"
import { signIn } from "next-auth/react";
import { SecondaryButton } from "./Button";

export default function Hero(){
    return(
        <div className="relative w-full h-min flex flex-col items-center gap-4 py-24">
            <div className="relative text-5xl font-semibold">
                Decentralized Trading, <span className="text-cyan-600">Reimagined</span>
            </div>
            <div className="text-2xl text-slate-400">
                Fast swaps, transparent liquidity, zero middlemen.
            </div>
            <SecondaryButton onClick={() => {
                signIn("google");
            }}>SignUp With Google</SecondaryButton>
        </div>
    )
}