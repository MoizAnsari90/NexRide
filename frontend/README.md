# NexRide - Frontend

A ride-hailing application frontend built with React, Vite, and Tailwind CSS.

## Tech Stack

- **React 19** with Vite 8
- **Tailwind CSS 4** for styling
- **GSAP** for smooth panel animations
- **Axios** for API calls
- **React Router DOM** for routing
- **Google Maps API** (Maps, Places, Directions, Geocoding)

## Features

### Authentication
- User login & signup
- Captain login & signup (with vehicle details)
- Token-based auth with protected routes
- Logout functionality

### User Side
- **Home page** with Google Map
- **Location search** with Google Places Autocomplete (real-time suggestions)
- **Pickup & destination markers** on the map with driving route
- **Vehicle selection panel** (NexAuto, NexGo, NexMoto)
- **Looking for driver** animation panel
- **Waiting for driver** panel with driver info
- **Riding in progress** panel with driver details and route
- **Profile drawer** (slide from left) showing user name, email, and menu items

### Captain Side
- **Captain Home** with online/offline toggle
- **Ride request popup** (swipeable bottom sheet) with rider info, route, and fare
- **Map integration** showing pickup & destination markers with route when ride request arrives
- **Mini bar** after swiping down ride request — tap to reopen
- **Profile drawer** showing captain name, email, vehicle details (type, color, plate, capacity)
- **Captain Riding** page with route on map and ride management
- **Captain Pickup Map** with real markers and route to pickup location

### Map Features
- Google Maps with custom styling (no POI/transit clutter)
- Green circle marker for pickup, dark circle for destination
- Driving route drawn between pickup and destination using Directions API
- Auto-fit bounds to show full route
- Places Autocomplete biased to Karachi/Pakistan

### UI/UX
- Smooth GSAP animations for all sliding panels
- Swipeable bottom sheets (touch + mouse drag support)
- Responsive design for mobile screens
- Clean emerald + black color scheme

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with base URL
├── components/
│   ├── GoogleMap.jsx          # Map with markers, route, Places library
│   ├── LocationSearchPanel.jsx # Google Places Autocomplete search
│   ├── VehiclePanel.jsx       # Vehicle selection (Auto/Car/Moto)
│   ├── LookingForDriver.jsx   # Searching for driver UI
│   ├── WaitingForDriver.jsx   # Driver found UI
│   ├── Riding.jsx             # Ride in progress UI
│   └── SwipeablePanel.jsx     # Reusable swipeable bottom sheet
├── context/
│   ├── UserContext.jsx         # User state management
│   └── CaptainContext.jsx      # Captain state management
├── pages/
│   ├── Start.jsx               # Landing page
│   ├── UserLogin.jsx           # User login
│   ├── UserSignup.jsx          # User registration
│   ├── Home.jsx                # Main user page (map + panels + drawer)
│   ├── Riding.jsx              # Dedicated riding page
│   ├── Userlogout.jsx          # Logout handler
│   ├── UserProtectWrapper.jsx  # Auth guard for user routes
│   ├── captainLogin.jsx        # Captain login
│   ├── CaptainSignup.jsx       # Captain registration
│   ├── CaptainHome.jsx         # Captain dashboard (map + drawer + ride popup)
│   ├── CaptainRiding.jsx       # Captain ride management
│   ├── CaptainPickupMap.jsx    # Captain navigation to pickup
│   └── CaptainProtectWrapper.jsx # Auth guard for captain routes
└── App.jsx                     # Route definitions
```

## Environment Variables

```
VITE_BASE_URL=http://localhost:4000
```

## Google APIs Required

Enable these in Google Cloud Console for your API key:

1. **Maps JavaScript API**
2. **Places API**
3. **Directions API**
4. **Geocoding API**

## Getting Started

```bash
npm install
npm run dev
```
