'use client'
import React, { useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "react-hot-toast"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  const handleLogin = async (): Promise<void> => {
    try {
      const res: Response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        toast.success("Logged In Successfully");
        router.push("/dashboard")
      } else {
        alert("Login failed. Sign up if you have not created an account.")
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
        position="top-right"
        reverseOrder={false}
      />
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Log In</h2>
        <Input placeholder="Email" value={email} onChange={onEmailChange} />
        <Input placeholder="Password" type="password" value={password} onChange={onPasswordChange} />
        <Button onClick={handleLogin} className="w-full cursor-pointer">Log In</Button>

        <p className="text-sm text-center text-gray-500">
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