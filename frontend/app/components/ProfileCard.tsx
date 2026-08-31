"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InvertedPrimaryButton, PrimaryButton, SecondaryButton } from "./Button";
import { TokenWithbalance, useTokens } from "../hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import { Loader } from "./loader";
import { Funds } from "./Funds";
import { Send } from "./Send";

export default function ProfileCard({pubKey}:{
    pubKey : string
}){

    const session = useSession();
    const router = useRouter();
    const {tokenBalances, loading} = useTokens(pubKey);
    const [active , setActive] = useState<"send" | "addFunds" | "withdraw" | "swap" | "token">("token");

    const tabs = [
        {id: "send", label: "Send"},
        {id: "addFunds", label: "Add Funds"},
        {id: "withdraw", label: "Withdraw"},
        {id: "swap", label: "Swap"},
    ] as const

    useEffect(() => {
        if(session.status === "unauthenticated"){
            router.push("/");
        }
    },[session.status, router])

    if (session.status === "loading"){
        return <div>Loading ...</div>
    }
    if (!session.data?.user){
       return null
    }

    const name = session.data?.user?.name ?? "";
    const pic = session.data?.user?.image ?? "";
    return(
            <div className="bg-white h-min w-fit lg:min-w-2/5 p-4 flex flex-col rounded-lg shadow-2xl">
                <Greetings name={name}  image={pic} />
                <UserAssest publicKey = {pubKey} loading={loading} tokenBalances={tokenBalances} />
                <div className="flex gap-2 py-2">
                    {tabs.map(tab => (
                        active === tab.id ? (
                        <PrimaryButton key={tab.id} onClick={() => setActive(tab.id)}>{tab.label}</PrimaryButton> 
                        ):( 
                        <InvertedPrimaryButton 
                        key={tab.id} 
                        onClick={() => setActive(tab.id)}
                        >
                            {tab.label}
                        </InvertedPrimaryButton>)
                    ))}
                </div>
                <div>
                    {active === "send" && (
                        <div className="flex flex-col gap-1 w-full">
                            <Send tokens={tokenBalances!.tokens} setActive={setActive}/>
                        </div>
                    )}

                    {active === "addFunds" && (
                        <div className="flex flex-col gap-1 w-full">
                            <Funds publicKey={pubKey}/>
                        </div>
                    )}

                    {active === "withdraw" && (
                        <div className="flex flex-col gap-1 w-full">
                            <div className="text-gray-800 font-semibold text-sm bg-gray-100 p-4 rounded-xl">
                                Sorry, we don't support this feature yet.
                            </div>
                            <div>
                                <InvertedPrimaryButton onClick={() => {setActive("token")}}>Cancel</InvertedPrimaryButton>
                            </div>
                        </div>
                    )}

                    {active === "swap" && (
                        <div className="flex flex-col gap-2 w-full">
                            <Swap tokens={tokenBalances?.tokens || []} setActive={setActive} pubKey={pubKey}/>
                        </div>
                    )}
                </div>
                <div>
                    {active === "token" && <TokenList tokens={tokenBalances?.tokens || []}/>
}                </div>
            </div>
    )
}

function UserAssest({publicKey, loading, tokenBalances}:{
    publicKey : string,
    loading: boolean,
    tokenBalances: {
        totalBalance: number;
        tokens: TokenWithbalance[];
    } | null
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

    if(loading){
        return (
            <div>
                <Loader />
            </div>
        )
    }

    return(
        <div className="flex flex-col p-2">
            <div className="text-sm">
                Zerex Account Assests
            </div>
            <div className="flex w-full justify-between">
                <div>
                <span className="text-4xl font-bold">${tokenBalances?.totalBalance.toPrecision(4)}</span>
                <span className="font-bold text-2xl text-gray-400">USD</span>
                </div>
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