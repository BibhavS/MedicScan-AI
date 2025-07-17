import connectToDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    await connectToDB();
    try {
        const response = NextResponse.json({
            message: "Logged out Successfully",
            success: true
        }, {status: 201})

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 0,
            expires: new Date(0)
        })

        return response;
 
        
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {status: 500})  
    }
}