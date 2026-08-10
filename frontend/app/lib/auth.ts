import GoogleProvider from "next-auth/providers/google";
import prismaClient from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Session } from "next-auth";

export interface session extends Session {
    user:{
        email: string;
        name: string;
        image: string;
        uid: string;
    }
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    callbacks: {

        session:({session, token}: any): session =>{
            const newSession: session = session as session;
            if(newSession.user && token.uid){
                //@ts-ignore
                newSession.user.uid = token.uid ?? "";
            }
            return newSession!;
        },

        async jwt({token, account, profile}:any) {
            const user = await prismaClient.user.findFirst({
                where:{
                    sub: account?.providerAccountId ?? ""
                }
            })
            if(user) {
                token.uid = user.id
            }
            return token
        },

        async signIn({user, account, profile, email, credentials}: any){
            if(account?.provider == "google"){
                const email = user.email;
                const name = profile?.name;
                //@ts-ignore
                const profilePic = profile?.picture;

                if(!email){
                    return false;
                }

                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                const privateKey = keypair.secretKey;

                const userDb = await prismaClient.user.upsert({
                    where: {
                        username: email
                    },
                    update:{},
                    create:{
                        username: email,
                        name: name,
                        profilePicture: profilePic,
                        provider: "google",
                        sub: account.providerAccountId,
                        solWallet:{
                            create:{
                                publicKey: publicKey,
                                privateKey: privateKey.toString(),
                            }
                        },
                        inrWalet: {
                            create:{
                                balance: 0
                            }
                        }
                    }
                })
            }    
            return true
        },
    }
}