import DashboardLayoutViews from "@/components/dashboard/dashboard-layout"
import type React from "react"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutViews><div>{children}</div></DashboardLayoutViews>
}
