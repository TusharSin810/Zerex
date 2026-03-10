import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prismaClient from "@/app/db";

const handler = NextAuth({

    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}){
            if(account?.provider == "google"){
                const email = user.email;
                if(!email){
                    return false;
                }
                const userDb = await prismaClient.user.upsert({
                    where: {
                        username: email
                    },
                    update:{},
                    create:{
                        username: email,
                        provider: "google",
                        solWallet:{
                            create:{
                                publicKey:"",
                                privateKey:"",
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
})

export {handler as GET, handler as POST}