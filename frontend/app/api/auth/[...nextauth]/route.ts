import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
            }    
            return true
        },
    }
})

export {handler as GET, handler as POST}