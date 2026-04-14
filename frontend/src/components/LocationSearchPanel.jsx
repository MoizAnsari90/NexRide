import React, { useEffect, useState, useRef } from 'react'
import { loadGoogleMapsScript } from './GoogleMap'

const LocationSearchPanel = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState([])
  const autocompleteService = useRef(null)
  const placesService = useRef(null)
  const dummyDiv = useRef(null)

  useEffect(() => {
    const init = async () => {
      await loadGoogleMapsScript()
      await window.google.maps.importLibrary('places')
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
      // PlacesService needs a DOM element or map
      if (!dummyDiv.current) {
        dummyDiv.current = document.createElement('div')
      }
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv.current)
    }
    init()
  }, [])

  useEffect(() => {
    if (!query || query.length < 2 || !autocompleteService.current) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'pk' },
          location: new window.google.maps.LatLng(24.8607, 67.0011),
          radius: 50000,
        },
        (predictions, status) => {
          if (status === 'OK' && predictions) {
            setSuggestions(predictions)
          } else {
            setSuggestions([])
          }
        }
      )
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const handleSelect = (place) => {
    if (!placesService.current) return

    placesService.current.getDetails(
      { placeId: place.place_id, fields: ['geometry', 'name', 'formatted_address'] },
      (result, status) => {
        if (status === 'OK' && result?.geometry?.location) {
          onSelect({
            name: result.name,
            address: result.formatted_address,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          })
        }
      }
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className='text-center py-4'>
        <p className='text-sm text-gray-400'>Type to search for a location</p>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {suggestions.map((place) => (
        <div
          key={place.place_id}
          onClick={() => handleSelect(place)}
          className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl active:bg-gray-100 cursor-pointer transition-all'
        >
          <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-gray-800 truncate'>
              {place.structured_formatting.main_text}
            </p>
            <p className='text-xs text-gray-400 truncate'>
              {place.structured_formatting.secondary_text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LocationSearchPanel
