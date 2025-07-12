import connectToDB from "@/lib/dbConnect";
import mongoose from "mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await connectToDB();
    try {
        const {username, email, password} = await request.json();
        
        
    } catch (error) {
        console.log("There was some error registering the user\nError : ", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while registering the user"
            }, {status: 500}
        )
    }
}