import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const prismaClientSingleton = () => {
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });
    return(
        prisma
    )
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prismaClient = globalForPrisma.prisma ?? prismaClientSingleton();

export default prismaClient;

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;