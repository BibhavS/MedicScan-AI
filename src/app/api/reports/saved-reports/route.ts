import connectToDB from "@/lib/dbConnect";
import Report from "@/models/Report";
import { getTokenData } from "@/utils/getTokenData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    await connectToDB();

    try {
        const userId = await getTokenData(request);

        const reports = await Report.find({userId: userId});

        if(!reports){
            return NextResponse.json({
                success: false,
                message: "Cannot get your reports"
            })
        }

        return NextResponse.json({
            success: true,
            data: reports
        })
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error getting the reports"
        }, {status: 500})
    }
}