import { resend } from "@/lib/resend";
import EmailFormat from "./EmailFormat";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendEmail(
    email: string,
    username: string,
    code: string,
    emailType: string,
) : Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            react: EmailFormat({username, token: code})

        });
        return {success: true, message: "Email send successfully"};
        
    } catch (emailError) {
        console.error("Error sending email", emailError);
        return {success: false, message: 'Failed to send the email'};
    }
}
