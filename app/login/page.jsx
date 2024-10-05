"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";


const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    if (res?.ok) {
      return router.push("/");
    }
  };
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md ">
        <Form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="username" className="text-sm mt-4 font-medium">Username</Label>
            <Input id="username" type="text" placeholder="Enter your username" className="p-2 border border-gray-300 rounded" name="username" />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="text-sm mt-4 font-medium">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password" 
                className="p-2 border border-gray-300 rounded" 
                name="password" 
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

          <Button type="submit" className="w-full mt-7 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Login
          </Button>

          <p className="text-sm mt-5 text-center text-gray-600">
            Don't have an account? 
            <Link href="/signup" className="text-indigo-600 hover:underline"> Register</Link>
          </p>
        </Form>
      </div>
    </section>
  );
}

export default Login