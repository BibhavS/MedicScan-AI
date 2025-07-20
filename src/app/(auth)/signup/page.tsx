'use client'
import React, { useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast, Toaster } from "react-hot-toast"
import { signUpSchema } from "@/schemas/signUpSchema"

export default function SignupPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const result = signUpSchema.safeParse(user);

      if (result.success) {
        const response = await axios.post("/api/users/signup", user, {
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (response.data.success) {
          console.log(response.data);
          const encodedUsername = encodeURIComponent(user.username);
          router.push(`/verifyemail?username=${encodedUsername}`);
        }
        else {
          toast.error(response.data.message);
        }
      }
      else{
        toast.error("Please check your fields properly");
      }

    } catch (error: any) {
      toast.error(error.message);
      console.log("error occured");
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="mt-16 text-center text-4xl font-semibold">MedicScan AI</h1>
      <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-md space-y-4">
        <h2 className="text-3xl font-semibold text-center">Sign Up</h2>
        <Input
          placeholder="Username"
          className="my-8"
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <Input
          placeholder="Email"
          className="my-8"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          className="my-8"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Button onClick={handleSignup} className="w-full cursor-pointer py-5">Sign Up</Button>

        <p className="text-sm text-center text-gray-500 mt-3">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
            type="button"
          >
            Log In
          </button>
        </p>
      </div>
    </>
  )
}