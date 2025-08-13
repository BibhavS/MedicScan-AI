'use client';
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/navbar';

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

  const fetchUserData = async () => {
    try {
      const response = await axios.post("/api/users/profile", {}, {
        withCredentials: true
      });
      const userData = response.data.data;
      setUser({...user, username: userData.username, email: userData.email});
      console.log(userData);

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
        <div>
        <NavBar/>
        <div className='p-8 flex flex-col text-3xl items-center gap-8'>
          Loading.....
        </div>
      </div>
    )
  }

  return (
    <>
      <div className=''>
        <NavBar/>
        <div className='p-8 flex flex-col items-center gap-8'>
          <h1 className='text-4xl font-semibold'>Your Profile</h1>
          <div className='flex flex-col gap-10 mt-6'>
            <h1 className='text-2xl border-2 p-4 rounded-xl'>Username : {user?.username}</h1>
            <h1 className='text-2xl border-2 p-4 rounded-xl'>Email : {user?.email}</h1>
          </div>
        </div>
      </div>
    </>
  )
}
