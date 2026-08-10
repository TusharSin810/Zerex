"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./Button";

export default function ProfileCard({pubKey}:{
    pubKey : string
}){

    const session = useSession();
    const router = useRouter();

    if (session.status === "loading"){
        return <div>Loading ...</div>
    }
    if (!session.data?.user){
        router.push("/")
        return null
    }

    const name = session.data?.user?.name ?? "";
    const pic = session.data?.user?.image ?? "";
    return(
            <div className="bg-white h-min w-2/5 p-4 flex flex-col rounded-lg shadow-2xl">
                <Greetings name={name}  image={pic} />
                <UserAssest publicKey = {pubKey} />
                <div className="flex gap-4 p-2">
                    <button>Send</button>
                    <button>Add Funds</button>
                    <button>Withdraw</button>
                    <button>Swap</button>
                </div>
            </div>
    )
}

function UserAssest({publicKey}:{
    publicKey : string
}){

    const [copied, setcopied] = useState(false);

    useEffect(() => {
        if(copied){
            let timeout = setTimeout(() => {
                setcopied(false);
            },3000)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [copied])

    return(
        <div className="flex flex-col p-2">
            <div className="text-sm">
                Zerex Account Assests
            </div>
            <div className="flex w-full justify-between">
                <span>$0.00 USD</span>
                <PrimaryButton onClick={() => {
                    navigator.clipboard.writeText(publicKey)
                    setcopied(true)
                }}>{copied ? "Copied" : "Your Wallet Address"}</PrimaryButton>
            </div>
        </div>
    )
}

function Greetings({name, image}:{
    name : string
    image : string
}){
    return(
        <div className="p-2 flex gap-1">
            <img className="rounded-full h-7" src={image}></img>Welcome Back, {name} !
        </div>
    )
}