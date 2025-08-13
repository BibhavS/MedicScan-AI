'use client';
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/navbar';
import Image from 'next/image';
import { IReport } from '@/models/Report';

export default function Dashboard() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<IReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

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
      else {
        console.log(response.data.data);
        setData(response.data.data);
        setShowReport(true);
        toast.success("Your report has been prepared");
      }

    } catch (error) {
      toast.error("Error getting the report");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <div className='p-8 flex flex-col items-center justify-center gap-8'>
          <h1 className='text-3xl mb-2 font-medium'>Upload your Medical Report/Document</h1>
          <div className='flex items-center gap-4'>
            <Input type='file' onChange={handleFileChange} className='cursor-pointer' />
            <Button onClick={handleFileUpload} disabled={loading} className='p-5 cursor-pointer'>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
        {showReport && (
           <div className='flex justify-center'>
            <div className='mt-5 flex justify-center w-4/5 gap-5'>
            <div className='animate-fadeIn'>
              {data?.fileUrl && (
                <Image
                  src={data.fileUrl}
                  alt="Report-image"
                  height={550}
                  width={300}
                  className='transition-all duration-1000 ease-out'
                />
              )}
            </div>
            <div className='w-3/5 animate-fadeIn'>
              <p className='text-justify'>{data?.content}</p>
            </div>
          </div>
           </div>
        )}
      </div>
    </>
  )
}
