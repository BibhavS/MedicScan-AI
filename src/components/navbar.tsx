"use client"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

export default function NavBar() {

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

  const router = useRouter();

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className='p-7 border-r-2 flex justify-between gap-8 mb-10'>
        <div className="flex gap-20 text-2xl text-black items-center">
          <h1 className="text-center text-3xl font-semibold">MedicScan AI</h1>
          <div className="flex gap-10 font-medium text-xl">
            <h1 onClick={() => router.push('/dashboard')} className='cursor-pointer hover:underline'>Home</h1>
            <h1 onClick={() => router.push('/myreports')} className='cursor-pointer hover:underline'>My Reports</h1>
            <h1 onClick={() => router.push('/profile')} className='cursor-pointer hover:underline'>Profile</h1>
          </div>
        </div>
        <Button onClick={handleLogout} className='cursor-pointer p-5'>Log out</Button>
      </div>
    </>
  )
}