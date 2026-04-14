import React, { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

const SwipeablePanel = ({ isOpen, onClose, children, zIndex = 30 }) => {
  const panelRef = useRef(null)
  const dragStart = useRef(null)
  const currentY = useRef(0)
  const panelHeight = useRef(0)

  useEffect(() => {
    if (!panelRef.current) return
    if (isOpen) {
      gsap.to(panelRef.current, { y: 0, duration: 0.5, ease: 'power4.out' })
    } else {
      gsap.to(panelRef.current, { y: '100%', duration: 0.4, ease: 'power4.in' })
    }
  }, [isOpen])

  const handleTouchStart = useCallback((e) => {
    dragStart.current = e.touches[0].clientY
    currentY.current = 0
    panelHeight.current = panelRef.current?.offsetHeight || 0
    gsap.killTweensOf(panelRef.current)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (dragStart.current === null) return
    const diff = e.touches[0].clientY - dragStart.current
    // only allow dragging down
    if (diff > 0) {
      currentY.current = diff
      gsap.set(panelRef.current, { y: diff })
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (dragStart.current === null) return
    const threshold = panelHeight.current * 0.3
    if (currentY.current > threshold) {
      // swipe down past threshold → close
      gsap.to(panelRef.current, { y: '100%', duration: 0.3, ease: 'power3.in' })
      onClose?.()
    } else {
      // snap back open
      gsap.to(panelRef.current, { y: 0, duration: 0.3, ease: 'power3.out' })
    }
    dragStart.current = null
    currentY.current = 0
  }, [onClose])

  // mouse events for desktop
  const mouseDown = useRef(false)

  const handleMouseDown = useCallback((e) => {
    mouseDown.current = true
    dragStart.current = e.clientY
    currentY.current = 0
    panelHeight.current = panelRef.current?.offsetHeight || 0
    gsap.killTweensOf(panelRef.current)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!mouseDown.current || dragStart.current === null) return
    const diff = e.clientY - dragStart.current
    if (diff > 0) {
      currentY.current = diff
      gsap.set(panelRef.current, { y: diff })
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!mouseDown.current) return
    mouseDown.current = false
    const threshold = panelHeight.current * 0.3
    if (currentY.current > threshold) {
      gsap.to(panelRef.current, { y: '100%', duration: 0.3, ease: 'power3.in' })
      onClose?.()
    } else {
      gsap.to(panelRef.current, { y: 0, duration: 0.3, ease: 'power3.out' })
    }
    dragStart.current = null
    currentY.current = 0
  }, [onClose])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      ref={panelRef}
      className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl translate-y-full'
      style={{ zIndex }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag Handle */}
      <div
        className='flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing'
        onMouseDown={handleMouseDown}
      >
        <div className='w-10 h-1 bg-gray-300 rounded-full' />
      </div>

      <div className='px-6 pb-6'>
        {children}
      </div>
    </div>
  )
}

export default SwipeablePanel
