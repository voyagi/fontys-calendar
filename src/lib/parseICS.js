import ICAL from 'ical.js'

export function parseICS(icsData) {
  const jcalData = ICAL.parse(icsData)
  const comp = new ICAL.Component(jcalData)
  const vevents = comp.getAllSubcomponents('vevent')

  return vevents.map(vevent => {
    const event = new ICAL.Event(vevent)
    
    return {
      id: event.uid,
      title: event.summary,
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
      location: event.location,
      description: event.description,
      extendedProps: {
        attendees: vevent.getAllProperties('attendee').map(attendee => 
          attendee.getFirstValue().replace('MAILTO:', '')
        )
      }
    }
  })
}