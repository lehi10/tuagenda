"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">GH Project</h1>
      <Button onClick={() => router.push("/login")}>Ir al Login</Button>
    </div>
  )
}
