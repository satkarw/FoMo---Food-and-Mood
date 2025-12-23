"use client"

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import Router from "next/navigation";
import { useRouter } from "next/navigation";
import { useNotify } from "@/context/NotifierContext";

export default function RegistrationForm() {
  const router = useRouter()
  const { notify } = useNotify();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const { register } = useAuth();
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await register(formData);
    notify("Registration successful!");
    router.push("/login")
  } catch (err) {
    notify("Error: " + err.response?.data?.detail || err.message,'error');
  }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      {/* Username */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-[#333333] font-['Open_Sans'] font-semibold"
        >
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
          placeholder="Choose a unique username"
          className={`w-full px-4 py-3 rounded-2xl bg-white border-2 transition-all duration-200 font-['Open_Sans']
            ${
              focusedField === "username"
                ? "border-[#6BCB77] shadow-[0_4px_12px_rgba(107,203,119,0.2)]"
                : "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            }
            hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            focus:outline-none`}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-[#333333] font-['Open_Sans'] font-semibold"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          required
          placeholder="your.email@example.com"
          className={`w-full px-4 py-3 rounded-2xl bg-white border-2 transition-all duration-200 font-['Open_Sans']
            ${
              focusedField === "email"
                ? "border-[#6BCB77] shadow-[0_4px_12px_rgba(107,203,119,0.2)]"
                : "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            }
            hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            focus:outline-none`}
        />
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["first_name", "last_name"].map((field) => (
          <div key={field} className="space-y-2">
            <label
              htmlFor={field}
              className="block text-[#333333] font-['Open_Sans'] font-semibold"
            >
              {field === "first_name" ? "First Name" : "Last Name"}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              value={formData[field]}
              onChange={handleChange}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField(null)}
              required
              placeholder={field === "first_name" ? "First name" : "Last name"}
              className={`w-full px-4 py-3 rounded-2xl bg-white border-2 transition-all duration-200 font-['Open_Sans']
                ${
                  focusedField === field
                    ? "border-[#6BCB77] shadow-[0_4px_12px_rgba(107,203,119,0.2)]"
                    : "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                }
                hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                focus:outline-none`}
            />
          </div>
        ))}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-[#333333] font-['Open_Sans'] font-semibold"
        >
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
            placeholder="Create a secure password"
            className={`w-full px-4 py-3 pr-12 rounded-2xl bg-white border-2 transition-all duration-200 font-['Open_Sans']
              ${
                focusedField === "password"
                  ? "border-[#6BCB77] shadow-[0_4px_12px_rgba(107,203,119,0.2)]"
                  : "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              }
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
              focus:outline-none`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF6B35]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#FF6B35] text-white py-3.5 rounded-2xl font-['Poppins'] font-semibold hover:bg-[#E55A25] hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] active:scale-[0.98] shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
      >
        Create Account
      </button>

      {/* Sign In */}
      <p className="text-center text-[#666666] font-['Open_Sans'] mt-6">
        Already have an account?{" "}
        <a
          href="#"
          className="text-[#FF6B35] hover:text-[#E55A25] font-semibold"
        >
          Sign In
        </a>
      </p>
    </form>
  );
}
