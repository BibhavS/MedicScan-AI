import connectToDB from "@/lib/dbConnect";
import mongoose from "mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(request: NextRequest){
    await connectToDB();
    try {
        const {username, email, password} = await request.json();

        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true
        });

        if(existingUserVerifiedByUsername){
            console.log("Username taken");
            return NextResponse.json({
                success: false,
                message: "This username is already taken"
            })  
        }

        const existingUserByEmail = await User.findOne({email});
        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                console.log("Email taken");
                return NextResponse.json({
                    success: false,
                    message: "User with this email address already exists"
                })
            }
            else{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                existingUserByEmail.password = hashedPassword;  
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();              
            }
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false
            })

            await newUser.save();
        }

        const emailType = "VERIFY";

        const emailResponse = await sendEmail(
            email,
            username,
            verifyCode,
            emailType
        );

        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            })
        }

        return NextResponse.json({
            success: true,
            message: "User has been registered, Please verify your email"
        }, {status: 201})
        
    } catch (error: any) {
        console.log("There was some error registering the user\nError : ", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while registering the user",
                error: error.message
            }, {status: 500})
    }
}