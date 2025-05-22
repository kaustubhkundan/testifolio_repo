"use client"
import DashboardLayoutViews from "@/components/dashboard/dashboard-layout"
import type React from "react"
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isCollectionForm = pathname?.match(/^\/dashboard\/collection-forms\/[^\/]+$/);

  if (isCollectionForm) {
    return <>{children}</>;
  }

  return <DashboardLayoutViews>{children}</DashboardLayoutViews>
}
