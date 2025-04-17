"use client"

import type React from "react"

import { User, FileText, HelpCircle, Book, Shield, MessageSquare } from "lucide-react"

interface SettingsTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <TabButton
        icon={<User className="h-4 w-4" />}
        label="Account"
        isActive={activeTab === "account"}
        onClick={() => setActiveTab("account")}
      />
      <TabButton
        icon={<FileText className="h-4 w-4" />}
        label="Billing"
        isActive={activeTab === "billing"}
        onClick={() => setActiveTab("billing")}
      />
      <TabButton
        icon={<HelpCircle className="h-4 w-4" />}
        label="Preferences"
        isActive={activeTab === "preferences"}
        onClick={() => setActiveTab("preferences")}
      />
      <TabButton
        icon={<Book className="h-4 w-4" />}
        label="Branding"
        isActive={activeTab === "branding"}
        onClick={() => setActiveTab("branding")}
      />
      <TabButton
        icon={<FileText className="h-4 w-4" />}
        label="Integrations"
        isActive={activeTab === "integrations"}
        onClick={() => setActiveTab("integrations")}
      />
      <TabButton
        icon={<Shield className="h-4 w-4" />}
        label="Security"
        isActive={activeTab === "security"}
        onClick={() => setActiveTab("security")}
      />
      <TabButton
        icon={<MessageSquare className="h-4 w-4" />}
        label="Support"
        isActive={activeTab === "support"}
        onClick={() => setActiveTab("support")}
      />
    </div>
  )
}

interface TabButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? "bg-[#7c5cff] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
