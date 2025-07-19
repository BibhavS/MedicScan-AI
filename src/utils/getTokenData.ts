import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export const getTokenData = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        const decodedToken : any = verifyToken(token);
        return decodedToken.id;
        
    } catch (error: any) {
        throw new Error(error.message);  
    }
}
