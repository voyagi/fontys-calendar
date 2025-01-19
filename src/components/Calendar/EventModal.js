'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function EventModal({ isOpen, onClose, event, selectedDate, onEventUpdate }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    class_type: '',
    group_name: '',
    teacher_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start_time: event.start,
        end_time: event.end,
        location: event.location || '',
        class_type: event.class_type || '',
        group_name: event.group_name || '',
        teacher_name: event.teacher_name || ''
      })
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        start_time: selectedDate.start,
        end_time: selectedDate.end
      }))
    }
  }, [event, selectedDate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const eventData = {
      ...formData,
      user_id: user.id
    }

    try {
      if (event) {
        const { error: updateError } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', event.id)
        
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('calendar_events')
          .insert([eventData])
        
        if (insertError) throw insertError
      }
      
      onEventUpdate()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { error: deleteError } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', event.id)
      
      if (deleteError) throw deleteError
      
      onEventUpdate()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {event ? 'Edit Event' : 'New Event'}
          </h3>
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={formData.start_time.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={formData.end_time.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 border rounded"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Class Type"
                className="w-full p-2 border rounded"
                value={formData.class_type}
                onChange={(e) => setFormData({ ...formData, class_type: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Group Name"
                className="w-full p-2 border rounded"
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Teacher Name"
                className="w-full p-2 border rounded"
                value={formData.teacher_name}
                onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={loading}
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : event ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}