'use client'
import { useState, useEffect } from 'react'

export default function GroupSettings() {
  const [selectedGroups, setSelectedGroups] = useState([])

  const groupStructure = {
    GROW: ['01_FYSIO_103-5', '01_FYSIO_103-4', '01_FYSIO_103-3', '01_FYSIO_103-2', '01_FYSIO_103-1'],
    EXPLORE1: ['01_FYSIO_103d', '01_FYSIO_103c', '01_FYSIO_103b', '01_FYSIO_103a'],
    EXPLORE2: ['01_FYSIO_103d', '01_FYSIO_103c', '01_FYSIO_103b', '01_FYSIO_103a'],
    COLLABORATE: ['01_FYSIO_103d', '01_FYSIO_103c', '01_FYSIO_103b', '01_FYSIO_103a']
  }

  useEffect(() => {
    // Load saved preferences
    const savedGroups = localStorage.getItem('selectedGroups')
    if (savedGroups) {
      setSelectedGroups(JSON.parse(savedGroups))
    }
  }, [])

  const handleGroupChange = (group) => {
    setSelectedGroups(prev => {
      const newGroups = prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
      
      // Save to localStorage
      localStorage.setItem('selectedGroups', JSON.stringify(newGroups))
      return newGroups
    })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Group Settings</h2>
      
      {Object.entries(groupStructure).map(([className, groups]) => (
        <div key={className} className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{className}</h3>
          <div className="space-y-2">
            {groups.map(group => (
              <label key={group} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedGroups.includes(group)}
                  onChange={() => handleGroupChange(group)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{group}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 