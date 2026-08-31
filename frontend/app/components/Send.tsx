"use client";

import { useState } from "react";
import axios from "axios";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithbalance } from "../hooks/useTokens";
import { PrimaryButton, InvertedPrimaryButton } from "./Button";

export function Send({
    tokens,
    setActive,
}: {
    tokens: TokenWithbalance[];
    setActive: any;
}) {
    const [token, setToken] = useState<TokenDetails>(SUPPORTED_TOKENS[0]);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const balance =
        tokens.find(t => t.name === token.name)?.balance ?? "0";

    const handleSend = async () => {
        if (!recipient || !amount || Number(amount) <= 0) return;

        try {
            setLoading(true);

            const response = await axios.post("/api/transfer", {
                recipient,
                amount,
                mint: token.mint,
                decimals: token.decimals
            });

            if(response.data.success){
                console.log("Transaction", response.data.signature);
            
                setRecipient("");
                setAmount("");
                setActive("token");
            }

        } catch (error) {
            console.error("Transfer failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-2 flex flex-col gap-2">

            <h1 className="text-xl font-bold">
                Send Funds
            </h1>
            <div className="bg-gray-200 p-4 flex flex-col gap-2 rounded-xl">
                <p className="text-sm text-gray-700 font-semibold">
                    Send SOL and supported tokens to another wallet.
                </p>
                <div className="flex items-center justify-between">
                    <select
                        value={token.name}
                        onChange={e => {
                            const selected = SUPPORTED_TOKENS.find(
                                t => t.name === e.target.value
                            );

                            if (selected) {
                                setToken(selected);
                                setAmount("");
                            }
                        }}
                        className="p-2 bg-gray-100 rounded-xl"
                    >
                        {SUPPORTED_TOKENS.map(t => (
                            <option key={t.name} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <span className="text-xs text-gray-500">
                        Balance: {Number(balance).toPrecision(4)} {token.name}
                    </span>
                </div>
                <input
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    placeholder="Recipient wallet address"
                    className="p-2 rounded-xl w-[85%] outline-none bg-gray-100 text-sm" 
                />

                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder={`Amount in ${token.name}`}
                    className="p-2 bg-gray-100 rounded-xl w-fit outline-none text-sm"
                />
            </div>
            <div className="flex justify-between mt-1 w-full p-2">
                <InvertedPrimaryButton
                    onClick={() => setActive("token")}
                >
                    Cancel
                </InvertedPrimaryButton>

                <PrimaryButton
                    onClick={handleSend}
                    disabled={
                        loading ||
                        !recipient ||
                        !amount ||
                        Number(amount) <= 0
                    }
                >
                    {loading ? "Sending..." : "Send"}
                </PrimaryButton>
            </div>
        </div>
    );
}