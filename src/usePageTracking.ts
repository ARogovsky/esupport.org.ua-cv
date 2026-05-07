import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from './analytics'

/**
 * Hook to track page views in Google Analytics
 * Automatically sends pageview events on route changes
 */
export function usePageTracking(): void {
  const location = useLocation()

  useEffect(() => {
    // Construct full URL path (pathname + search + hash)
    const url = location.pathname + location.search + location.hash
    
    // Track pageview
    trackPageView(url)
  }, [location])
}
