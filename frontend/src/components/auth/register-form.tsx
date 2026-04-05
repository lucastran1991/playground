"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth-schema"
import { apiFetch } from "@/lib/api-client"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(data: RegisterFormData) {
    setError(null)
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Registration succeeded but auto-login failed. Please sign in.")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  const eyeOff = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

  const eyeOn = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-lg bg-[#f0997b]/10 p-3 text-sm text-[#f0997b] mb-5">
          {error}
        </div>
      )}

      <h1 className="text-[22px] font-medium text-white mb-1.5">Create account</h1>
      <p className="text-[13px] text-white/50 mb-8">
        Already have an account?{" "}
        <Link href="/login" className="text-[#afa9ec] hover:underline">
          Sign in
        </Link>
      </p>

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className="text-[12px] text-white/50 mb-1.5 block">Name</label>
        <input
          id="name"
          placeholder="Your name"
          {...register("name")}
          className="w-full glass-input rounded-[10px] py-[11px] px-3.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
        />
        {errors.name && (
          <p className="text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="text-[12px] text-white/50 mb-1.5 block">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full glass-input rounded-[10px] py-[11px] px-3.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
        />
        {errors.email && (
          <p className="text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="text-[12px] text-white/50 mb-1.5 block">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            {...register("password")}
            className="w-full glass-input rounded-[10px] py-[11px] px-3.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
          />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            {showPassword ? eyeOff : eyeOn}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="mb-2">
        <label htmlFor="confirmPassword" className="text-[12px] text-white/50 mb-1.5 block">Confirm Password</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat password"
            {...register("confirmPassword")}
            className="w-full glass-input rounded-[10px] py-[11px] px-3.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
          />
          <button type="button" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            {showConfirm ? eyeOff : eyeOn}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-[10px] gradient-btn text-white text-sm font-medium flex items-center justify-center gap-2 mt-2 mb-5 transition-all cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-[11px] text-white/50 text-center leading-relaxed">
        By signing up you agree to our{" "}
        <Link href="/terms" className="text-white/50 hover:text-white/70 transition-colors">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className="text-white/50 hover:text-white/70 transition-colors">Privacy Policy</Link>
      </p>
    </form>
  )
}
