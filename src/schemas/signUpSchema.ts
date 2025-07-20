import {z} from "zod";

export const usernameValidation = z.string()
    .min(2, "Username must have atleast 2 characters")
    .max(20, "Username must have no more than 20 characters")
    
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must have at least 6 characters"})
})
    
