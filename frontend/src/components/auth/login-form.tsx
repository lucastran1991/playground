"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth-schema"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginFormData) {
    setError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      return
    }

    setShowSuccess(true)
    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 1400)
  }

  return (
    <div className="relative">
      {/* Success overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[8px] rounded-3xl flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-16 h-16 rounded-full bg-[rgba(29,158,117,0.25)] border-2 border-[#1d9e75] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="text-lg font-medium text-white">Welcome back!</div>
          <div className="text-[13px] text-white/50">Redirecting to dashboard...</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General error */}
        {error && (
          <div className="rounded-lg bg-[#f0997b]/10 p-3 text-sm text-[#f0997b] mb-5">
            {error}
          </div>
        )}

        <h1 className="text-[22px] font-medium text-white mb-1.5">Sign in</h1>
        <p className="text-[13px] text-white/50 mb-8">
          No account?{" "}
          <Link href="/register" className="text-[#afa9ec] hover:underline">
            Start for free
          </Link>
        </p>

        <SocialLoginButtons />

        {/* Divider */}
        <div className="flex items-center mb-5">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[11px] text-white/50 px-3">or continue with email</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="text-[12px] text-white/50 mb-1.5 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="w-full glass-input rounded-[10px] py-[11px] px-3.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
          />
          {errors.email && (
            <p className="text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-[12px] text-white/50 block">
              Password
            </label>
            <Link href="/forgot-password" className="text-[11px] text-[#afa9ec] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              {...register("password")}
              className="w-full glass-input rounded-[10px] py-[11px] px-3.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-[10px] gradient-btn text-white text-sm font-medium flex items-center justify-center gap-2 mt-2 mb-5 transition-all cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        {/* Terms */}
        <p className="text-[11px] text-white/50 text-center leading-relaxed">
          By signing in you agree to our{" "}
          <Link href="/terms" className="text-white/50 hover:text-white/70 transition-colors">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-white/50 hover:text-white/70 transition-colors">Privacy Policy</Link>
        </p>
      </form>
    </div>
  )
}
