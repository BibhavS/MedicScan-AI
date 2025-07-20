'use client';
import { Button } from '@/components/ui/button'
import React from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(response.data.success){
        console.log(response.data);
        toast.success("Logged out successfully");
        router.push('/login');
      }

    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      console.log("error occured");
    }
  }
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className='flex m-10 justify-between'>
        <Button onClick={handleLogout} className='cursor-pointer'>Log out</Button>
        <Button onClick={() => router.push('/profile')} className='cursor-pointer'>Profile</Button>
      </div>
    </>
  )
}
