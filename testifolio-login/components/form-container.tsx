"use client"

import type { ReactNode } from "react"

interface FormContainerProps {
  children: ReactNode
  useGradientBackground?: boolean
}

export function FormContainer({ children, useGradientBackground = false }: FormContainerProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: useGradientBackground ? "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)" : undefined,
      }}
    >
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">{children}</div>
    </div>
  )
}
