import connectToDB from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest){
    await connectToDB();
    try {
        const {email, password} = await request.json();

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User with this email address does not exist"
            })
        }

        console.log("User exists");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return NextResponse.json({
                success: false,
                message: "Please check your credentials"
            })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = generateToken(tokenData);

        const response = NextResponse.json({
            success: true,
            message: "Logged In Successfully"
        }, {status: 200})

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24
        })

        return response;  

    } catch (error: any) {
        console.log("Error logging in, Please try again | ", error);
        return NextResponse.json({
            success: false,
            message: "Error logging in",
            error: error.message
        }, {status: 500})
    }
}