import React, { useEffect, useRef, useState } from 'react'

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

let scriptLoadPromise = null


export const loadGoogleMapsScript = () => {
  if (scriptLoadPromise) return scriptLoadPromise

  scriptLoadPromise = new Promise((resolve) => {
    if (window.google?.maps?.importLibrary) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

const GoogleMap = ({ center = { lat: 24.8607, lng: 67.0011 }, zoom = 15, className = '', pickupCoords, destinationCoords }) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const pickupMarker = useRef(null)
  const destMarker = useRef(null)
  const directionsRenderer = useRef(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const initMap = async () => {
      await loadGoogleMapsScript()
      const { Map } = await window.google.maps.importLibrary('maps')

      if (cancelled || !mapRef.current) return

      mapInstance.current = new Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        ],
      })
      setMapReady(true)
    }

    initMap()

    return () => { cancelled = true }
  }, [])

  // Pickup marker
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return

    if (pickupMarker.current) {
      pickupMarker.current.setMap(null)
      pickupMarker.current = null
    }

    if (pickupCoords) {
      pickupMarker.current = new window.google.maps.Marker({
        position: pickupCoords,
        map: mapInstance.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })

      if (!destinationCoords) {
        mapInstance.current.panTo(pickupCoords)
        mapInstance.current.setZoom(15)
      }
    }
  }, [mapReady, pickupCoords?.lat, pickupCoords?.lng])

  // Destination marker
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return

    if (destMarker.current) {
      destMarker.current.setMap(null)
      destMarker.current = null
    }

    if (destinationCoords) {
      destMarker.current = new window.google.maps.Marker({
        position: destinationCoords,
        map: mapInstance.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#1f2937',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })

      if (!pickupCoords) {
        mapInstance.current.panTo(destinationCoords)
        mapInstance.current.setZoom(15)
      }
    }
  }, [mapReady, destinationCoords?.lat, destinationCoords?.lng])

  // Route between pickup and destination
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return

    // Clear previous route
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null)
      directionsRenderer.current = null
    }

    if (pickupCoords && destinationCoords) {
      const directionsService = new window.google.maps.DirectionsService()
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: mapInstance.current,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#10b981',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      })

      directionsService.route(
        {
          origin: pickupCoords,
          destination: destinationCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && directionsRenderer.current) {
            directionsRenderer.current.setDirections(result)

            // Fit bounds to show full route
            const bounds = new window.google.maps.LatLngBounds()
            bounds.extend(pickupCoords)
            bounds.extend(destinationCoords)
            mapInstance.current.fitBounds(bounds, { top: 80, bottom: 350, left: 40, right: 40 })
          }
        }
      )
    }
  }, [mapReady, pickupCoords?.lat, pickupCoords?.lng, destinationCoords?.lat, destinationCoords?.lng])

  return <div ref={mapRef} className={`h-full w-full ${className}`} />
}

export default GoogleMap
