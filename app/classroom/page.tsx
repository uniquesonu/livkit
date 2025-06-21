"use client"

import { useEffect, useState } from "react"
import {
  LiveKitRoom,
  RoomName,
  VideoConference,
  ControlBar,
  Chat,
  RoomAudioRenderer,
  LayoutContextProvider,
  useCreateLayoutContext,
  FocusLayout,
  ConnectionStateToast,
  MessageFormatter,
  PreJoin,
  useLocalParticipant,
} from "@livekit/components-react"
import { Loading } from "../components/loading"
import { Track } from "livekit-client"
import { MessageSquare, Video, VideoOff, Mic, MicOff } from "lucide-react"

export default function Classroom() {
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(true)
  const [userName, setUserName] = useState("")
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const layoutContext = useCreateLayoutContext()

  useEffect(() => {
    const storedName = localStorage.getItem("classroom-username")
    if (storedName) {
      setUserName(storedName)
    } else {
      const newName = "student-" + Math.floor(Math.random() * 1000)
      localStorage.setItem("classroom-username", newName)
      setUserName(newName)
    }
  }, [])

  useEffect(() => {
    async function getToken() {
      if (!userName) return
      
      try {
        const res = await fetch("/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userName,
            room: "math-class",
          }),
        })

        if (!res.ok) throw new Error("Failed to get token")

        const data = await res.json()
        setToken(data.token)
      } catch (error) {
        console.error("Failed to get token:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getToken()
  }, [userName])

  if (isLoading) {
    return <Loading message="Joining classroom..." />
  }

  if (!token) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-500">Failed to join classroom</h2>
          <p className="mt-2 text-gray-600">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <LayoutContextProvider value={layoutContext}>
      <LiveKitRoom
        token={token}
        serverUrl="wss://first-project-mt75r4v9.livekit.cloud"
        connect={true}
        video={isVideoEnabled}
        audio={isAudioEnabled}
        data-lk-theme="default"
        className="h-screen flex flex-col bg-gray-50"
      >
        <ConnectionStateToast />
        
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-4 flex flex-col min-h-0">
            <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <RoomName />
                <span className="text-gray-300">|</span>
                <span className="text-gray-700">{userName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-2 rounded-full transition-colors ${
                    isVideoEnabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`p-2 rounded-full transition-colors ${
                    isAudioEnabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`p-2 rounded-full transition-colors ${
                    showChat ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden min-h-0">
              <VideoConference
                className="h-full"
              />
            </div>
          </main>
          
          {showChat && (
            <aside className="w-80 border-l border-gray-200 bg-white flex flex-col animate-slide-in overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Class Chat</h2>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <Chat />
              </div>
            </aside>
          )}
        </div>
        
        <div className="bg-white border-t border-gray-200">
          <ControlBar 
            variation="minimal"
            className="p-4"
          />
        </div>
        <RoomAudioRenderer />
      </LiveKitRoom>
    </LayoutContextProvider>
  )
}
