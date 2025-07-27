'use client';
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  }

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please upload your file first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("api/reports/upload-report", formData, {
        headers: {
          "Content-Type": "multipart/form/data"
        },
        withCredentials: true
      })

      console.log(response.data?.error);

      if (!response.data.success) {
        toast.error("Error fetching your report summary");
      }
      else{
        console.log(response.data.data);
        toast.success("Your report has been prepared");
      }

    } catch (error) {
      toast.error("Error getting the report");
    }
    finally {
      setLoading(false);
    }
  }
  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
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
      <div className='flex'>
        <div className='w-1/5 h-screen p-8 border-r-2 flex flex-col gap-8'>
          <h1 className="text-center text-3xl font-semibold mb-10">MedicScan AI</h1>
          <Button onClick={() => router.push('/profile')} className='cursor-pointer'>Profile</Button>
          <Button className='cursor-pointer'>My Reports</Button>
          <Button onClick={handleLogout} className='cursor-pointer'>Log out</Button>
        </div>
        <div className='w-4/5 h-screen p-8 flex flex-col items-center gap-8'>
          <h1 className='text-3xl mb-10 font-semibold'>Upload your Medical Report</h1>
          <Input type='file' onChange={handleFileChange} className='w-1/4 cursor-pointer' />
          <Button onClick={handleFileUpload} disabled={loading} className='p-6 cursor-pointer'>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </>
  )
}
