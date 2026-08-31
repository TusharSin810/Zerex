"use client";

import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import zerexLogo from '../../public/Zerex_logo.png'

export default function Appbar(){
    
    const session = useSession();
    const router = useRouter();

    return(
        <div className="relative flex justify-between items-center p-4 bg-cyan-50/80">
            <div className="realtive flex gap-2 h-min items-center">
                <Image className="rounded-4xl" src={zerexLogo} width={40} height={40} alt="Website Logo"/>
                <span className="font-medium text-2xl cursor-pointer" onClick={() => {router.push("/")}}>Zerex</span>
            </div>
            <div className="relative flex items-center gap-2">
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