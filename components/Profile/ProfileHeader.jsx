"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { Pen, Camera } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ProfileHeader({ loading = false, profile, onUpdate }) {
  const [name, setName] = useState(profile?.name || "")
  const [prevName, setPrevName] = useState(profile?.name || "")
  const [edit, setEdit] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [updating, setUpdating] = useState(false)
  const fileInputRef = useRef(null)

  const handleCancel = () => {
    setName(prevName)
    setEdit(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setUpdating(true)

    try {
      await onUpdate({
        username: name.trim(),
        profilePic: selectedFile,
      })

      setPrevName(name)
      setEdit(false)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleEdit = () => {
    setName(prevName)
    setEdit(true)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB")
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (loading) {
    return (
      <div className="w-full px-4 pb-8 flex flex-col items-center animate-pulse">
        <div className="text-2xl font-bold mb-6 bg-gray-300 h-6 w-48 rounded" />
        <div className="mx-auto bg-gray-300 w-full text-white flex flex-col items-center py-6 rounded-md">
          <div className="rounded-full bg-gray-400 size-20 md:size-24" />
          <div className="flex gap-2 mt-4 items-center">
            <div className="bg-gray-400 h-5 w-32 rounded" />
            <div className="bg-gray-400 h-5 w-5 rounded-full" />
          </div>
          <div className="flex gap-2 mt-4 items-center">
            <div className="bg-gray-400 h-4 w-16 rounded" />
            <div className="bg-gray-400 h-4 w-1.5 rounded-full" />
            <div className="bg-gray-400 h-4 w-16 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 pb-8 h-auto min-w-fit max-w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#35590E]">Profile Page</h1>

      <div className="mx-auto bg-[#35590E] w-full  text-white flex flex-col items-center py-6 rounded-md relative">
        {/* Profile Picture */}
        <div className="relative">
          <Image
            className="mt-3 object-cover rounded-full bg-red-400 size-20 md:size-24"
            alt="profile"
            src={previewUrl || profile?.profilePic || "/placeholder.svg?height=96&width=96"}
            width={96}
            height={96}
          />

          {edit && (
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-white text-[#35590E] rounded-full p-2 hover:bg-gray-100 transition-colors"
              title="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* Name Section */}
        <div className="flex gap-2 mt-4 items-center">
          {edit ? (
            <input
              name="name"
              className="text-lg font-normal items-center bg-white text-black border-2 border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updating}
            />
          ) : (
            <div className="flex items-center justify-center align-center">
              <h3 className="text-lg font-bold items-center">{profile?.name}</h3>
              <button onClick={handleEdit} className="ml-2">
                <Pen className="text-white size-4 hover:text-gray-300 transition-colors" />
              </button>
            </div>
          )}
        </div>

        {/* Subtitles */}
        <div className="flex gap-2 m-3 text-sm md:text-base items-center">
          <p>{profile?.subtitles1}</p>
          {profile?.subtitles2 && (
            <>
              <span className="text-lg">&#8226;</span>
              <p>{profile?.subtitles2}</p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {edit && (
          <div className="flex gap-3 items-center">
            <button
              onClick={handleCancel}
              disabled={updating}
              className="p-1 mb-2 w-20 rounded-md bg-transparent border border-red-400 text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updating || !name.trim()}
              className="p-1 mb-2 w-20 text-black rounded-md bg-green-400 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {updating ? "..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
