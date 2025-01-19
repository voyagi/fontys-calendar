import GroupSettings from '@/components/Settings/GroupSettings'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <GroupSettings />
      </div>
    </div>
  )
} 