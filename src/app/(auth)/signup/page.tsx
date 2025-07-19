'use client'
import React, { useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function SignupPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await axios.post("/api/users/signup", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      const encodedUsername = encodeURIComponent(user.username)
      router.push(`/verifyemail?username=${encodedUsername}`);

    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      console.log("error occured");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
      <Input
        placeholder="Username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <Input
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <Input
        placeholder="Password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Button onClick={handleSignup} className="w-full cursor-pointer">Sign Up</Button>

      <p className="text-sm text-center text-gray-500">
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
  )
}