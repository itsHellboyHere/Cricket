import { auth } from "@/auth";
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { error } from "console";

export async function PUT(req:Request){
    const session = await auth();
    const {userId,imageUrl} = await req.json();

    if(!session?.user || session.user.id !== userId){
        return NextResponse.json(
            {error:'Unauthorized'},
            {status: 401}
        );
    }

    try{
        const updatedUser = await prisma.user.update({
            where:{id:userId},
            data:{image:imageUrl},
        });
        return NextResponse.json(updatedUser)
    }
    catch(error){
        return NextResponse.json(
            {error:'Failed to update image'},
            {status: 500}
        );
    }
}