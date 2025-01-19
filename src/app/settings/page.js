'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Settings() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({
    email_notifications: false,
    push_notifications: false,
    browser_notifications: false
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchPreferences()
    }
  }, [user])

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setPreferences(data)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = async (key) => {
    try {
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key]
      }

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        })

      if (error) throw error

      setPreferences(newPreferences)
      setMessage('Preferences updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating preferences:', error)
      setMessage('Error updating preferences')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
            <div className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex-grow">
                    <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                    <span className="block text-sm text-gray-500">Receive email notifications for upcoming events</span>
                  </span>
                  <button
                    onClick={() => handlePreferenceChange('email_notifications')}
                    className={`${
                      preferences.email_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className={`${
                      preferences.email_notifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex-grow">
                    <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                    <span className="block text-sm text-gray-500">Receive push notifications on your devices</span>
                  </span>
                  <button
                    onClick={() => handlePreferenceChange('push_notifications')}
                    className={`${
                      preferences.push_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className={`${
                      preferences.push_notifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex-grow">
                    <span className="text-sm font-medium text-gray-900">Browser Notifications</span>
                    <span className="block text-sm text-gray-500">Receive notifications in your browser</span>
                  </span>
                  <button
                    onClick={() => handlePreferenceChange('browser_notifications')}
                    className={`${
                      preferences.browser_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className={`${
                      preferences.browser_notifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {message && (
          <div className="mt-4 p-4 rounded-md bg-green-50">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}