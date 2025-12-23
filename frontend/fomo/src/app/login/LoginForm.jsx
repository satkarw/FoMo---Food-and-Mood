"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotify } from "@/context/NotifierContext";

export default function LoginForm() {
  const router = useRouter();
  const { notify } = useNotify();
  const { login } = useAuth(); // <-- make sure to destructure login
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // this method isnt setting cookies
const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log("Starting login with formData:", formData);

  try {
    await login(formData);
    console.log("Login successful!");
    notify("Logged in successfully!");
    router.push("/")
    
  } catch (err) {
    console.error("Login error:", err);
    notify(
      "Login failed: " +
        (err?.data?.detail ||
         err?.data?.non_field_errors?.[0] ||
         "Invalid credentials")
         , 'error'
    );
  }
};

// //this method sets only cors cookies 
// const handleSubmit = async (e) => {
//     e.preventDefault();
//   const res = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
//     method: 'POST',
//     credentials: 'include',   // important: send/receive cookies
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(formData)
//   });
//   if (!res.ok) throw new Error('Login failed');
//   return res.json(); // server set cookies; response may be small

// }


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      {/* User name */}
      <div className="space-y-2">
        <label  className="block text-[#333333] font-['Open_Sans'] font-semibold">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          onFocus={() => setFocusedField("username")}
          onBlur={() => setFocusedField(null)}
          required
          placeholder="Enter your user name"
          className={`w-full px-4 py-3 rounded-2xl bg-white border-2 transition-all duration-200 font-['Open_Sans'] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] focus:outline-none focus:border-[#6BCB77] focus:shadow-[0_4px_12px_rgba(107,203,119,0.2)] ${
            focusedField === "username"
              ? "border-[#6BCB77] shadow-[0_4px_12px_rgba(107,203,119,0.2)]"
              : "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          }`}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-[#333333] font-['Open_Sans'] font-semibold">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            required
            placeholder="Enter your password"
            className={`w-full px-4 py-3 pr-12 rounded-2xl bg-white border-2 transition-all duration-200 font-['Open_Sans'] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] focus:outline-none focus:border-[#6BCB77] focus:shadow-[0_4px_12px_rgba(107,203,119,0.2)] ${
              focusedField === "password"
                ? "border-[#6BCB77] shadow-[0_4px_12px_rgba(107,203,119,0.2)]"
                : "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF6B35] transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#FF6B35] text-white py-3.5 rounded-2xl font-['Poppins'] font-semibold transition-all duration-200 hover:bg-[#E55A25] hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] active:scale-[0.98] shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
      >
        Sign In
      </button>

      {/* Switch */}
      <p className="text-center text-[#666666] font-['Open_Sans'] mt-6">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/registration")}
          className="text-[#FF6B35] hover:text-[#E55A25] font-semibold transition-colors duration-200"
        >
          Create Account
        </button>
      </p>
    </form>
  );
}
