"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";


const Signup = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!")
    if (!email || !username || !password) {
      setError("All fields are necessary.");
      return;
    }
    try{
      const resUserExists = await fetch('/api/userExists', {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
      });

      const {user} = await resUserExists.json();

      if (user) {
        setError('User already exists.');
        return;
      }setTimeout(() => {
        setError('');
      }, 20000)

      const res = await fetch("/api/register", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, 
          username, 
          password,
        }),
      });
      if (res.ok){
        console.log("Registration successful");
        const form = e.target;
        form.reset();
        router.push("/")
      }else{
        console.log("User registration failed.")
        setError("User registration failed");
      }
      // Clear the response message after 20 seconds
      setTimeout(() => {
        setError('');
    }, 20000); // 20 seconds
    } catch (error){
      console.log ("Error during resgistration: ", error);
    }
  };



  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md boarder">

        <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>

          <h1 className="mb-6 text-2xl font-bold text-center">Create an account</h1>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="text-sm mt-4 font-medium">Email</Label>
            <Input 
            onChange={(e) => setEmail(e.target.value)} 
            id="email" 
            type="text" 
            placeholder="Enter your email" 
            className="p-2 border border-gray-300 rounded" 
            required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="username" className="text-sm mt-3 font-medium">Username</Label>
            <Input 
            onChange={(e) => setUsername(e.target.value)}
            id="username" 
            type="text" 
            placeholder="Enter your username" 
            className="p-2 border border-gray-300 rounded" 
            required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="text-sm mt-3 font-medium">Password</Label>
            <div className="relative">
              <Input 
                onChange={(e) => setPassword(e.target.value)}
                id="password" 
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password" 
                className="p-2 border border-gray-300 rounded" 
                required
              />
              <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setShowPassword((prev) => !prev)} 
              >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
        </div>

          <Button type='submit' className="w-full mt-7 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Create account
          </Button>

          { error && (
            <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
          </div>
          )}
          

          <p className="text-sm mt-5 text-center text-gray-600">
            Already have an account? 
            <Link href="/login" className="text-indigo-600 hover:underline"> Login</Link>
          </p>
        </form>
      </div>
    </section>  
  )
}

export default Signup