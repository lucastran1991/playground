"use client"

import { signOut } from "next-auth/react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const { user } = useAuth()
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="rounded-full outline-none ring-ring focus-visible:ring-2" />
        }
      >
        {/* sm = h-8 w-8 */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs text-white font-medium bg-white/[0.15]">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        style={{
          background: "rgba(12, 10, 35, 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.13)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div className="px-1.5 py-1">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-white/50">{user?.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-white/[0.07]" />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer text-[#f0997b] focus:text-[#f0997b] focus:bg-[rgba(216,90,48,0.12)]"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
