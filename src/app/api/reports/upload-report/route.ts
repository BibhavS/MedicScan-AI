import Report from "@/models/Report";
import connectToDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/utils/getTokenData";
import cloudinary from "@/lib/cloudinary";
import { openai } from "@/lib/openai";


export const config = {
    api: { bodyParser: false }
}

export async function POST(request: NextRequest) {
    await connectToDB();
    try {
        const userId = await getTokenData(request);
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({
                success: false,
                message: "Cannot access the file"
            })
        }

        if (!(file instanceof Blob)) {
            return NextResponse.json({
                success: false,
                message: "Invalid file"
            },)
        }

        const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedFileTypes.includes(file.type)) {
            return NextResponse.json({
                success: false,
                message: "Unsupported file type"
            })
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        const upload = await cloudinary.uploader.upload(dataUri, {
            folder: "medicscan",
            resource_type: "auto"
        });

        if (!upload) {
            return NextResponse.json({
                success: false,
                message: "Error uplaoding your file"
            })
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            max_tokens: 400,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please describe the content in this medical document. Be clear and simple. Highlight risks anad suggest medical steps as well"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: upload.secure_url
                        }
                    }
                ]
            }
            ]
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Cannot retrieve the summary of your report Please try again"
            })
        }

        const summary = response.choices[0]?.message?.content || "Summary could not be generated.";

        const newReport = new Report({
            userId,
            fileUrl: upload.secure_url,
            content: summary
        })

        await newReport.save();

        return NextResponse.json({
            success: true,
            message: "Success",
            data: newReport
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error getting the report : Error",
            error: error
        },)
    }
}