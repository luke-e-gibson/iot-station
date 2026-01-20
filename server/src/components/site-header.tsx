"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { use, useEffect, useState } from "react"

const useWindowLocation = () => {
  const [location, setLocation] = useState<string>("")

  useEffect(() => {
    setLocation(window.location.pathname)
  }, [])

  return location
}

export function SiteHeader() {
  const [location, setLocation] = useState("Dashboard")
  const windowLocation = useWindowLocation()

  useEffect(() => {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
    const stripSlashes = (s: string) => s.replace(/\//g, " ")
    const lastWord = (s: string) => {
      const parts = s.trim().split(" ")
      return parts[parts.length - 1]
    }
    if (windowLocation) {
      setLocation(capitalize(lastWord(stripSlashes(windowLocation))))
    }
  }, [windowLocation])


  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{location}</h1>
      </div>
    </header>
  )
}
