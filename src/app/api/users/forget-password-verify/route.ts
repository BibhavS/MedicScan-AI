import connectToDB from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await connectToDB();

    try {
        const {email, code} = await request.json();
        const decodedEmail = decodeURIComponent(email);
        const user = await User.findOne({email: decodedEmail});

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User with this email address does not exist"
            }, {status: 500})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            return NextResponse.json({
                success: true,
                message: "Password reset can be done"
            }, {status: 200})
        }

        else if(isCodeNotExpired){
            return NextResponse.json({
                success: false,
                message: "Reset password code has been expired"
            }, {status: 400})
        }

        else{
            return NextResponse.json({
                success: false,
                message: "Incorrect password reset code, Check your email again"
            }, {status: 400})
        }
        
    } catch (error: any) {

        return NextResponse.json({
            success: false,
            message: "Error in password reset code verification",
            error: error.message
        }, {status: 500})
        
    }
}