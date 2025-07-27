'use client';
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserInfo{
    username: string,
    email: string
}

export default function Profile() {
  const [user, setUser] = useState<UserInfo | null>({
    username: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await axios.post("/api/users/profile", {}, {
        withCredentials: true
      });
      const userData = response.data.data;
      setUser({...user, username: userData.username, email: userData.email});

    } catch (error: any) {
      console.error("Failed to fetch user data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchUserData(); 
  }, []);

  if(loading){
    return (
        <div className='text-center font-semibold text-2xl mt-10'>Loading...</div>
    )
  }

  return (
    <>
      <div className='flex m-10 justify-center'>
        <h1 className='text-3xl font-semibold'>Hello {user?.username}</h1>
      </div>
      <div className='flex justify-center'>
        <Button className='py-5 text-lg cursor-pointer' onClick={()=> router.push('/dashboard')}>Back</Button>
      </div>
    </>
  )
}
