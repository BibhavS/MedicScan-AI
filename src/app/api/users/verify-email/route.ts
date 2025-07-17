import connectToDB from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await connectToDB();

    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({username: decodedUsername});

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {status: 500})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                sucess: true,
                message: "Account verfied succesfully"
            }, {status: 200})
        }

        else if(isCodeNotExpired){
            return NextResponse.json({
                success: false,
                message: "Verification code has been expired, Please sign up again"
            }, {status: 400})
        }

        else{
            return NextResponse.json({
                success: false,
                message: "Incorrect verification code, Check your email again"
            }, {status: 400})
        }
        
    } catch (error) {
        console.log("Error verifying user", error);

        return NextResponse.json({
            success: false,
            message: "Error verifying the user"
        }, {status: 500})
        
    }
}