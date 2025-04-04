import { auth } from "../../../auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await auth();
    console.log("Session user ",session?.user)
    return NextResponse.json(session?.user|| {error:"Not authenticated"})
    
}