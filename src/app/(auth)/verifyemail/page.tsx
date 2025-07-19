'use client'
import React, { useState, ChangeEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage(){
  const searchParams = useSearchParams()
  const username: string = searchParams.get("username") ?? ""
  const [code, setCode] = useState<string>("")
  const router = useRouter()

  const handleVerify = async (): Promise<void> => {
    try {
      const res: Response = await fetch("/api/users/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      })

      if (res.ok) {
        alert("Email verified successfully!")
        router.push('/dashboard')
      } else {
        alert("Verification failed")
      }
    } catch (error) {
      alert("An unexpected error occurred")
      console.error(error)
    }
  }

  const onCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCode(e.target.value)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-center">Verify Your Email</h2>
      <p className="text-sm text-center text-gray-600">
        Code sent to email for: <strong>{username}</strong>
      </p>
      <Input
        placeholder="Enter 5-digit code"
        maxLength={5}
        value={code}
        onChange={onCodeChange}
      />
      <Button onClick={handleVerify} className="w-full cursor-pointer">Verify</Button>
    </div>
  )
}