'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavBar from '@/components/navbar';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { IReport } from '@/models/Report';
import Image from 'next/image';

interface UserInfo {
  username: string,
  email: string
}

export default function MyReports() {
  const [user, setUser] = useState<UserInfo | null>({
    username: "",
    email: ""
  });

  const [reports, setReports] = useState<[IReport] | null>(null);

  const [loading, setLoading] = useState(true);

  const getReports = async () => {
    try {
      const response = await axios.get("api/reports/saved-reports", {
        withCredentials: true
      })

      console.log(response.data?.error);

      if (!response.data.success) {
        toast.error("Error getting your reports");
      }
      else {
        console.log(response.data.data);
        setReports(response.data.data);
      }

    } catch (error) {
      toast.error("Error getting your reports");
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getReports();
  }, []);

  if (loading) {
    return (
      <div className=''>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <NavBar />
        <div className='p-8 flex flex-col text-3xl items-center gap-8'>
          Loading.....
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className=''>
        <NavBar />
        <div className='flex justify-center mt-8'>
          <div>
            <Carousel>
              <CarouselContent>
                {reports?.map((item, index) => (
                  <CarouselItem key={index} className="p-4">
                    <div className="rounded-lg border flex flex-row items-center gap-6 border-black p-6 text-center">
                      <Image
                        src={item.fileUrl!}
                        alt="Report-image"
                        height={500}
                        width={340}
                        className='transition-all duration-1000 ease-out'
                        priority
                        style={{ height: "auto" }}
                      />
                      <div className='text-justify text-sm mt-2' style={{width: 500}}>
                        <p>{item.content}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </>
  )
}
