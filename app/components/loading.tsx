import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white/80">
      <div className="flex items-center space-x-3 animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <span className="text-lg font-medium text-gray-700">{message}</span>
      </div>
      <p className="mt-2 text-sm text-gray-500">Please wait while we set things up</p>
    </div>
  )
} 