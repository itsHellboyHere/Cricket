import { prisma } from "./db";

export async function createUser({ email, password, name,username}:
    {   username:string;
        email: string;
        password: string;
        name: string;
    }
) {
    return await prisma.user.create({
        data:{
            username,
            email,
            password,
            name,
        },
    });
}

export async function getUserByEmail(email:string){
    return await prisma.user.findUnique({
        where:{email},
    })
}