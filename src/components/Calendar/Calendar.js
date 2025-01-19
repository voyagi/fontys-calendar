'use client'
import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid/main'
import timeGridPlugin from '@fullcalendar/timegrid/main'
import interactionPlugin from '@fullcalendar/interaction/main'
import listPlugin from '@fullcalendar/list/main'
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
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      <div className="p-4 space-y-4 bg-white shadow-sm sm:rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base flex-1 sm:flex-none"
            >
              Today
            </button>
            <button
              onClick={handleExportCalendar}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base flex-1 sm:flex-none"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>Lecture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: '#2196F3' }}></div>
            <span>Workshop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: '#F44336' }}></div>
            <span>Exam</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: '#FF9800' }}></div>
            <span>Practical</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full bg-white shadow-sm sm:rounded-lg p-2 sm:p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            initialView={window.innerWidth < 768 ? 'listWeek' : 'timeGridWeek'}
            views={{
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
              }
            }}
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
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{selectedEvent.title}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Start:</span> {selectedEvent.start.toLocaleString()}</p>
                <p><span className="font-medium">End:</span> {selectedEvent.end.toLocaleString()}</p>
                {selectedEvent.location && (
                  <p><span className="font-medium">Location:</span> {selectedEvent.location}</p>
                )}
                {selectedEvent.description && (
                  <p><span className="font-medium">Description:</span> {selectedEvent.description}</p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
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