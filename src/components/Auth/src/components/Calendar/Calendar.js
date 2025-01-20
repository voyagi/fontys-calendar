'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { supabase } from '@/lib/supabase'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setEvents(data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        description: event.description,
        location: event.location
      })))
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventAdd = async (info) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newEvent = {
        user_id: user.id,
        title: info.event.title,
        start_time: info.event.start,
        end_time: info.event.end,
        description: info.event.extendedProps.description || '',
        location: info.event.extendedProps.location || ''
      }

      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select()

      if (error) throw error
      await fetchEvents()
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const handleEventChange = async (info) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updatedEvent = {
        title: info.event.title,
        start_time: info.event.start,
        end_time: info.event.end,
        description: info.event.extendedProps.description,
        location: info.event.extendedProps.location
      }

      const { error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', info.event.id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchEvents()
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleEventDelete = async (info) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', info.event.id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        eventAdd={handleEventAdd}
        eventChange={handleEventChange}
        eventRemove={handleEventDelete}
        height="auto"
      />
    </div>
  )
} 