"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Square } from "lucide-react"

interface VideoRecorderProps {
  onBack: () => void
  onVideoRecorded: (videoBlob: Blob) => void
}

export function VideoRecorder({ onBack, onVideoRecorded }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const startRecording = () => {
    if (!stream) return

    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: "video/webm" })
      onVideoRecorded(videoBlob)
    }

    mediaRecorder.start()
    setIsRecording(true)
    setRecordingTime(0)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <div className="mb-6 flex justify-center">
        <div className="bg-gray-100 rounded-lg p-4 w-32 h-16 flex items-center justify-center">
          <span className="text-gray-400 text-sm">YOUR LOGO</span>
        </div>
      </div>

      <h1 className="mb-4 text-xl font-bold text-center text-gray-800">Share your experience with us!</h1>
      <p className="mb-6 text-gray-600 text-center">
        We'd really appreciate hearing your thoughts on your recent experience with our product, what you like about it,
        and why you'd recommend it. It means a lot to us!
      </p>

      <div className="relative mb-6 bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />

        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-sm flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            {formatTime(recordingTime)}
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center ${
              isRecording ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
            } transition-colors`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white fill-current" />
            ) : (
              <div className="w-6 h-6 bg-white rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Type your feedback here...</label>
        <textarea
          rows={6}
          className="w-full rounded-lg border-2 border-blue-200 px-4 py-3 focus:border-blue-400 focus:outline-none resize-none"
          placeholder="What problem were you facing before?&#10;How did our solution help?&#10;What specific results did you notice?"
        />
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Attach up to 3 image(s)</p>
        <div className="flex gap-3">
          <button className="flex items-center text-gray-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Attach an image
          </button>
          <button className="flex items-center text-blue-600 border border-blue-300 rounded-lg px-4 py-2 hover:bg-blue-50">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Refine with AI
          </button>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
        Submit
      </button>
    </div>
  )
}
