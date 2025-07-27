'use client'
import React, { useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"
import { loginSchema } from "@/schemas/loginSchema"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  const handleLogin = async (): Promise<void> => {

    const validationResult = loginSchema.safeParse({email, password});

    if(!validationResult.success){
      validationResult.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    try {
      const response = await axios.post(
        "/api/users/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      if (response.data.success) {
        toast.success("Logged In Successfully");
        router.push("/dashboard")
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Logging In");
      console.error(error)
    }
  }

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="mt-16 text-center text-4xl font-semibold">MedicScan AI</h1>
      <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-lg space-y-4">
        <h2 className="text-3xl font-semibold text-center">Sign In</h2>
        <Input placeholder="Enter your Email" value={email} onChange={onEmailChange} className="my-8" />
        <Input placeholder="Enter your Password" type="password" value={password} onChange={onPasswordChange} className="my-8" />
        <Button onClick={handleLogin} className="w-full cursor-pointer py-5">Log In</Button>

        <p className="text-sm text-center text-gray-500 mt-3">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>
    </>
  )
}