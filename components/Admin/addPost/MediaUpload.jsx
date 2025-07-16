"use client"

import { useRef, useState, useEffect } from "react"
import { ImageIcon, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const MediaUpload = ({ onFileChange, initialFile }) => {
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (initialFile instanceof File) {
      setPreviewUrl(URL.createObjectURL(initialFile))
    } else {
      setPreviewUrl(null)
    }
  }, [initialFile])

  const handleMediaClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileChange(file)
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      onFileChange(null)
      setPreviewUrl(null)
    }
  }

  const handleCancel = () => {
    onFileChange(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Button
        type="button"
        onClick={handleMediaClick}
        variant="outline"
        className="flex items-center gap-2 text-sm bg-transparent"
      >
        <ImageIcon size={18} />
        <span>Add Media</span>
      </Button>

      {previewUrl && (
        <div className="flex items-center gap-2">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md border"
          />
          <Button
            type="button"
            onClick={handleCancel}
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100"
            title="Remove Media"
          >
            <XCircle size={20} />
          </Button>
        </div>
      )}
    </div>
  )
}

export default MediaUpload
