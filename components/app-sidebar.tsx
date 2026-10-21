import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import {Suspense} from "react";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
       <Suspense fallback={<div>Loading...</div>}>
           
       </Suspense>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
