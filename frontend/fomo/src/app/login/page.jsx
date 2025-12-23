"use client";

import { Utensils } from "lucide-react"
import LoginForm from "./LoginForm";

export default function page(){

    return(
            <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 bg-[#6BCB77] opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FF6B35] opacity-10 rounded-full blur-3xl"></div>
        </div>

        {/* Main registration card */}
        <div className="relative w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-8 sm:p-10">
            {/* Logo and Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#FF6B35] to-[#E55A25] rounded-2xl mb-4 shadow-[0_4px_14px_rgba(255,107,53,0.3)]">
                <Utensils size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-[#333333]  mb-2" style={{ fontWeight: 700, fontSize: '32px', lineHeight: '1.2' }}>
                Welcome to FoMo
                </h1>
                <p className="text-[#666666]" style={{ fontSize: '16px' }}>
                Join the restaurant & social community
                </p>
            </div>

            {/* Login Form */}
            <LoginForm />
            </div>

            {/* Footer text */}
            <p className="text-center text-[#888888]  mt-6" style={{ fontSize: '13px' }}>
            By creating an account, you agree to our{' '}
            <a href="#" className="text-[#FF6B35] hover:underline">
                Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#FF6B35] hover:underline">
                Privacy Policy
            </a>
            </p>
        </div>
        </div>
    )
}