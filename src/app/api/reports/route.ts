import connectToDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { data } = await request.json();

    console.log(data);
    console.log("hello");

    try {
        const user = {
            username: "bibhav",
            email: "bibhav123@gmail.com",
        }
        return NextResponse.json({
            success: true,
            data: user
        })
    }

    catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}