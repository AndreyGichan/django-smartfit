"use client"

interface LoadingOverlayProps {
  show: boolean
}

export function LoadingOverlay({ show }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-12 h-12 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
  )
}
