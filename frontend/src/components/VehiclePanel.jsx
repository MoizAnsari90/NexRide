import React from 'react'

const VehiclePanel = ({ onSelect }) => {
  const vehicles = [
    { type: 'NexAuto', capacity: '3', time: '2 min', price: '150', icon: '🛺' },
    { type: 'NexGo', capacity: '4', time: '3 min', price: '250', img: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mNzI4MTEyMC1jYzFhLTRmZDQtODRkMS1mNWRmMmIzZjUxOGYuanBn' },
    { type: 'NexMoto', capacity: '1', time: '1 min', price: '80', img: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n' },
  ]

  return (
    <div className='space-y-3'>
      <h3 className='text-lg font-bold text-gray-800'>Choose a ride</h3>
      {vehicles.map((v, i) => (
        <div
          key={i}
          onClick={() => onSelect(v)}
          className='flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer active:bg-gray-100 border border-gray-200 hover:border-emerald-500 transition-all'
        >
          <div className='flex items-center gap-4'>
            {v.img ? <img src={v.img} alt={v.type} className='w-12 h-12 object-contain' /> : <span className='text-3xl'>{v.icon}</span>}
            <div>
              <p className='text-sm font-bold text-gray-800'>{v.type}</p>
              <p className='text-xs text-gray-400'>{v.capacity} seats · {v.time} away</p>
            </div>
          </div>
          <p className='text-sm font-bold text-gray-800'>Rs {v.price}</p>
        </div>
      ))}
    </div>
  )
}

export default VehiclePanel
