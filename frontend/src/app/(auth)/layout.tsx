import { AuthLeftPanel } from "@/components/auth/auth-left-panel"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-glass flex items-center justify-center relative overflow-hidden px-4">
      {/* Floating orbs */}
      <div className="orb w-[560px] h-[560px] bg-[#7f77dd] -top-40 -left-[140px] absolute" />
      <div className="orb w-[420px] h-[420px] bg-[#1d9e75] -bottom-[100px] -right-20 absolute" />
      <div className="orb w-[300px] h-[300px] bg-[#d4537e] top-1/2 right-[120px] -translate-y-1/2 absolute" />
      <div className="orb w-[200px] h-[200px] bg-[#ef9f27] bottom-[60px] left-[200px] opacity-[0.18] absolute" />

      {/* Auth card */}
      <div className="relative z-10 flex w-full max-w-[900px] min-h-[560px] rounded-3xl overflow-hidden border border-white/[0.12] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
        <AuthLeftPanel />
        <div className="w-full md:w-[400px] glass-dark p-6 md:p-[52px_44px] flex flex-col justify-center">
          {children}
        </div>
      </div>
    </main>
  )
}
