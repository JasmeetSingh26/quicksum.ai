"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { login, user } = useAuth();
  // console.log(user);

  useEffect(() => {
    if (user) {
      router.push("/dashboard/summary");
      console.log(user);
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      if (user) {
        router.push("/dashboard/summary");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-32 text-white px-6 lg:px-0">
      <h1 className="text-5xl font-thin mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="">
          <label htmlFor="email" className="block mb-2 font-thin">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 border border-blue-800 rounded-2xl bg-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-thin">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 border border-blue-800 rounded-2xl bg-gray-900"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="font-thin text-sm">
            Show password
          </label>
        </div>
        <button
          type="submit"
          className="w-full px-6 py-4 bg-blue-800 rounded-2xl hover:bg-blue-600 font-thin flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <AuthSpinner /> : "Login"}
        </button>
      </form>
      <div className="flex items-center justify-center mt-6 font-thin text-sm">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-blue-500 hover:text-blue-700 ml-2"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

function AuthSpinner() {
  return (
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
  );
}
