import { useEffect, useState } from "react";
import { SecondaryButton } from "./Button"

export function Funds({publicKey}:{
    publicKey: string
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
        <div>
            <h1 className="text-2xl font-bold">Add Funds</h1>
            <div className="bg-gray-100 p-4 rounded-xl flex flex-col gap-1">
                <p className="text-xl font-semibold mb-2">Send SOL or supported tokens to:</p>
                <p className="font-serif">{publicKey}</p>
                <div className="mb-2">
                    <SecondaryButton onClick={() => {
                        navigator.clipboard.writeText(publicKey)
                        setcopied(true)
                    }}>
                        {copied ? "Copied" : "Copy Address"}
                    </SecondaryButton>
                </div>
                <p className="text-xs font-bold text-gray-500">Only send supported Solana tokens.</p>
            </div>
        </div>
    )
}