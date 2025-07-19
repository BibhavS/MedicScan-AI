import User from "@/models/User";
import connectToDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/utils/getTokenData";

export async function POST(request: NextRequest){
    await connectToDB();
    try {
        const userId = await getTokenData(request);
        const user = await User.findOne({_id: userId}).select("-password");

        if(!user){
            return NextResponse.json({
                success: false,
                message: "Invalid Token",
            }, {status: 400})
        }

        return NextResponse.json({
            message: "User data extracted",
            data: user
        }, {status: 200})

    } catch (error: any) {
        console.log("Error getting the user data | ", error);

        return NextResponse.json({
            success: false,
            error: error.message
        }, {status: 500})  
    } 
}