import ICAL from 'ical.js'

export function parseICS(icsData) {
  try {
    const jcalData = ICAL.parse(icsData)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents('vevent')

    return vevents.map(vevent => {
      const event = new ICAL.Event(vevent)
      const startDate = event.startDate.toJSDate()
      const endDate = event.endDate.toJSDate()
      const description = vevent.getFirstPropertyValue('description') || ''
      const location = vevent.getFirstPropertyValue('location') || ''
      const summary = vevent.getFirstPropertyValue('summary') || ''

      return {
        title: summary,
        start: startDate,
        end: endDate,
        description: description,
        location: location,
        extendedProps: {
          description: description,
          location: location
        }
      }
    })
  } catch (error) {
    console.error('Error parsing ICS data:', error)
    return []
  }
}