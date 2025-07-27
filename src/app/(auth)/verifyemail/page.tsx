'use client'
import React, { useState, ChangeEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import { verifySchema } from '@/schemas/verifySchema'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const username: string = searchParams.get("username") ?? ""
  const [code, setCode] = useState<string>("")
  const router = useRouter()

  const handleVerify = async (): Promise<void> => {
    try {
      const result = verifySchema.safeParse({code});

      if(!result.success){
        toast.error(result.error.errors[0].message);
      }

      const response = await axios.post("/api/users/signup", {username, code}, {
          headers: {
            "Content-Type": "application/json",
          }
        });

      if (response.data.success) {
        toast.success("Email Verified successfully");
        router.push('/dashboard')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  }

  const onCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCode(e.target.value)
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="mt-16 text-center text-4xl font-semibold">MedicScan AI</h1>
      <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-md space-y-4">
        <h2 className="text-3xl font-semibold text-center">Verify Your Email</h2>
        <p className="text-sm text-center text-gray-600">
          Code sent to email for: <strong>{username}</strong>
        </p>
        <Input
          placeholder="Enter 5-digit code"
          maxLength={5}
          value={code}
          onChange={onCodeChange}
          className='my-8'
        />
        <Button onClick={handleVerify} className="w-full cursor-pointer py-5">Verify</Button>
      </div>
    </>
  )
}