import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Topbar } from "@/components/dashboard/topbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-glass relative overflow-hidden">
      {/* Subtle orbs for depth effect */}
      <div className="orb w-[400px] h-[400px] bg-[#7f77dd] -top-32 -left-24 absolute opacity-20" />
      <div className="orb w-[300px] h-[300px] bg-[#1d9e75] -bottom-20 -right-16 absolute opacity-20" />

      <SidebarProvider>
        <SidebarNav />
        <SidebarInset>
          <Topbar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
