'use client'
import { useState, useEffect, useRef } from 'react'
import FullCalendarComponent from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { parseICS } from '@/lib/parseICS'
import LoadingSpinner from '@/components/UI/LoadingSpinner'
import ErrorMessage from '@/components/UI/ErrorMessage'
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([])
  const calendarRef = useRef(null)

  const teacherMapping = {
    'PEEK06': 'Peelen, Kirsten',
    'ZUNB02': 'Zundert, Bastiaan',
    'BAKJ04': 'Bakker, Jurre',
    'BREJ13': 'Bree, Jeroen',
    'BERR22': 'Berkers, Ruud',
    'ENDF01': 'Ende, Feitze',
    'ONNM01': 'Onna, Martine',
    'BREL06': 'Breeden, Laura',
    'ELFE01': 'Elfring-Juffermans, Elke'
  }

  const CALENDAR_URL = 'https://fontys.myx.nl/api/InternetCalendar/feed/6ab40303-e395-493c-bdb6-813a4032d428/a63c10e2-8f7b-45aa-89f6-8572909a1331'

  useEffect(() => {
    fetchCalendarData()
    const refreshInterval = setInterval(fetchCalendarData, 30 * 60 * 1000)
    
    // Load saved group preferences
    const savedGroups = localStorage.getItem('selectedGroups')
    if (savedGroups) {
      setSelectedGroups(JSON.parse(savedGroups))
    }
    
    return () => clearInterval(refreshInterval)
  }, [])

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.extendedProps.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.extendedProps.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by selected groups
    if (selectedGroups.length > 0) {
      filtered = filtered.filter(event => {
        const description = event.extendedProps.description || ''
        return selectedGroups.some(group => description.includes(group))
      })
    }

    setFilteredEvents(filtered)
  }, [searchTerm, events, selectedGroups])

  const getFullTeacherName = (text) => {
    if (!text) return ''
    
    const teacherCodes = text.match(/[A-Z]{3,4}[0-9]{2}/g) || []
    
    teacherCodes.forEach(code => {
      if (teacherMapping[code]) {
        text = text.replace(code, teacherMapping[code])
      }
    })
    
    return text
  }

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(CALENDAR_URL)
      if (!response.ok) throw new Error('Failed to fetch calendar data')
      const icsData = await response.text()
      const parsedEvents = parseICS(icsData)
      
      const transformedEvents = parsedEvents.map(event => ({
        ...event,
        title: getFullTeacherName(event.title),
        description: getFullTeacherName(event.description),
        backgroundColor: getEventColor(event.title),
        borderColor: getEventColor(event.title),
        extendedProps: {
          ...event.extendedProps,
          originalDescription: event.description,
          location: event.location,
          formattedDescription: getFullTeacherName(event.description)
        }
      }))
      
      setEvents(transformedEvents)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching calendar:', err)
    } finally {
      setLoading(false)
    }
  }

  const getEventColor = (title) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('lecture')) return '#4CAF50'
    if (lowerTitle.includes('workshop')) return '#2196F3'
    if (lowerTitle.includes('exam')) return '#F44336'
    if (lowerTitle.includes('practical')) return '#FF9800'
    return '#9C27B0'
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      location: clickInfo.event.extendedProps.location,
      description: clickInfo.event.extendedProps.formattedDescription,
      attendees: clickInfo.event.extendedProps.attendees
    })
  }

  const handleExportCalendar = () => {
    const link = document.createElement('a')
    link.href = CALENDAR_URL
    link.download = 'fontys-calendar.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const goToToday = () => {
    const calendarApi = calendarRef.current.getApi()
    calendarApi.today()
  }

  if (loading && events.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="h-screen p-4">
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleExportCalendar}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
          <span>Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#2196F3' }}></div>
          <span>Workshop</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F44336' }}></div>
          <span>Exam</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF9800' }}></div>
          <span>Practical</span>
        </div>
      </div>

      <FullCalendarComponent
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        initialView="timeGridWeek"
        editable={false}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={filteredEvents}
        eventClick={handleEventClick}
        height="100%"
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        slotLabelInterval="01:00"
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '18:00',
        }}
        nowIndicator={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        weekNumbers={true}
        weekNumberFormat={{ week: 'numeric' }}
        eventDidMount={(info) => {
          info.el.title = `${info.event.title}\nLocation: ${info.event.extendedProps.location || 'N/A'}\n${info.event.extendedProps.formattedDescription || ''}`
        }}
      />
      
      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                {selectedEvent.title}
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p className="mb-1">
                  <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>End:</strong> {selectedEvent.end.toLocaleString()}
                </p>
                {selectedEvent.location && (
                  <p className="mb-1">
                    <strong>Location:</strong> {selectedEvent.location}
                  </p>
                )}
                {selectedEvent.description && (
                  <p className="mb-1">
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                )}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="mb-1">
                    <strong>Attendees:</strong>
                    <ul className="list-disc pl-5">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <li key={index}>{attendee}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}