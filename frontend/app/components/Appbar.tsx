"use client";

import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button";

export default function Appbar(){
    
    const session = useSession();

    return(
        <div className="relative flex justify-between items-center p-4 bg-cyan-50/80">
            <div className="realtive flex gap-2 h-min items-center">
                <img className="rounded-4xl" src="https://picsum.photos/20/30" />
                <span className="font-medium text-2xl">Zerex</span>
            </div>
            <div className="relative flex items-center gap-2">
                <div className="relative text-white bg-amber-300 box-border border border-transparent hover:bg-amber-400 leading-5 rounded-base text-xl px-2 py-2 rounded-xl cursor-pointer">
                   <span>&#128179;</span>
                </div>
                {session.data?.user? <PrimaryButton onClick={() => {
                    signOut()
                }}>
                    Logout
                </PrimaryButton> : <PrimaryButton onClick={() => {
                    signIn("google")
                }}>
                    Login
                    </PrimaryButton>}
            </div>
        </div>
    )
}