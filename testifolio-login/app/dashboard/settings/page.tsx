"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SettingsTabs from "@/components/settings/settings-tabs"
import {AccountSettings} from "@/components/settings/account-settings"
import BillingSettings from "@/components/settings/billing-settings"
import PreferencesSettings from "@/components/settings/preferences-settings"
import BrandingSettings from "@/components/settings/branding-settings"
import IntegrationsSettings from "@/components/settings/integrations-settings"
import {SecuritySettings} from "@/components/settings/security-settings"
import SupportSettings from "@/components/settings/support-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-[#7c5cff]">
              / Dashboard
            </Link>
            <span>/ Settings</span>
          </div>
        </div>

        {/* Tabs */}
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "billing" && <BillingSettings />}
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "branding" && <BrandingSettings />}
          {activeTab === "integrations" && <IntegrationsSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "support" && <SupportSettings />}
        </div>
      </div>
    </DashboardLayout>
  )
}
