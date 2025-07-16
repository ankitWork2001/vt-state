"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { axiosInstance } from "@/lib/axios"
import MediaUpload from "@/components/Admin/addPost/MediaUpload"
import NavigationMenu from "@/components/common/NavigationMenu"
import { Eye, Lock, Clock, PlusCircle } from "lucide-react"
import { ClipLoader } from "react-spinners"
import TextEditor from "@/components/Admin/addPost/TextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XCircle } from "lucide-react"
import DraftsList from "@/components/Admin/addPost/DraftsList" // Import the new component

const PostForm = () => {
  const { register, handleSubmit, setValue, watch, reset } = useForm()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("686e112f2f12f405927ec78c")
  const [subCategories, setSubCategories] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [tags, setTags] = useState([])
  const [language, setLanguage] = useState("English")
  const [newCategory, setNewCategory] = useState("")
  const [newSubcategory, setNewSubcategory] = useState("")
  const [showCatInput, setShowCatInput] = useState(false)
  const [showSubInput, setShowSubInput] = useState(false)
  const [mediaFile, setMediaFile] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [loading, setLoading] = useState(false) // For Publish button
  const [savingDraft, setSavingDraft] = useState(false) // For Save Draft button
  const [showDraftsList, setShowDraftsList] = useState(false) // To toggle drafts list visibility
  const [allDrafts, setAllDrafts] = useState([]) // To store all drafts
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const contentWatch = watch("content")

  useEffect(() => {
    const matchedCategory = categories.find((c) => c.id === selectedCategory)
    setSubCategories(matchedCategory?.subcategories || [])
    if (selectedSubCategory && !matchedCategory?.subcategories.some((sub) => sub.id === selectedSubCategory)) {
      setSelectedSubCategory(null)
    }
  }, [selectedCategory, categories, selectedSubCategory])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories")
        setCategories(res.data.data)
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  // Load all drafts and the most recent one on initial render
  useEffect(() => {
    if (categories.length === 0) return // Ensure categories are loaded before attempting to load drafts

    const savedDrafts = JSON.parse(localStorage.getItem("postDrafts") || "[]")
    setAllDrafts(savedDrafts)

    if (savedDrafts.length > 0) {
      // Load the most recent draft by default
      const mostRecentDraft = savedDrafts.sort((a, b) => b.savedAt - a.savedAt)[0]
      loadDraft(mostRecentDraft.id)
    }
  }, [categories]) // Depend on categories to ensure they are loaded for category/subcategory matching

  const loadDraft = (id) => {
    const draftToLoad = allDrafts.find((draft) => draft.id === id)
    if (draftToLoad) {
      console.log("Loading draft:", draftToLoad) // Debug log
      reset(draftToLoad) // Reset form with draft data
      setValue("content", draftToLoad.content) // Explicitly set content for TextEditor
      setSelectedCategory(draftToLoad.categoryId || "686e112f2f12f405927ec78c")
      setSelectedSubCategory(draftToLoad.subCategory || null)
      // Ensure tags are always an array, even if loaded as a string
      setTags(
        Array.isArray(draftToLoad.tags)
          ? draftToLoad.tags
          : (draftToLoad.tags || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0),
      )
      setLanguage(draftToLoad.language || "English")
      // Note: mediaFile from localStorage will be a string (name), not a File object.
      // MediaUpload and Preview components handle this by showing a placeholder.
      setMediaFile(draftToLoad.thumbnail || null)
      setShowDraftsList(false) // Hide drafts list after loading
    }
  }

  const deleteDraft = (id) => {
    const updatedDrafts = allDrafts.filter((draft) => draft.id !== id)
    setAllDrafts(updatedDrafts)
    localStorage.setItem("postDrafts", JSON.stringify(updatedDrafts))
    alert("Draft deleted.")
    // If the deleted draft was the one currently loaded, clear the form
    if (watch("id") === id) {
      reset()
      setValue("content", "")
      setMediaFile(null)
      setTags([])
      setPreviewData(null)
    }
  }

  const handlePreview = () => {
    setPreviewData({ ...watch(), mediaFile })
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      handlePreview()
      const formData = new FormData()
      const catObj = categories.find((c) => c.id === selectedCategory)

      formData.append("title", data.title || "")
      formData.append("content", data.content || "")
      formData.append("categoryId", catObj?.id || "")
      formData.append("language", language || "")

      if (selectedSubCategory) {
        formData.append("subcategoryId", selectedSubCategory)
      }

      // Join tags array into a comma-separated string
      if (tags && tags.length > 0) {
        formData.append("tags", tags.join(","))
      } else {
        formData.append("tags", "") // Send empty string if no tags
      }

      if (mediaFile) {
        formData.append("thumbnail", mediaFile)
      }

      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`)
      }

      const postRes = await axiosInstance.post("/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Post submitted:", postRes.data)
      alert("Post published successfully!")
      reset()
      setValue("content", "")
      setMediaFile(null)
      setTags([])
      setPreviewData(null)
      // Remove the draft if it was successfully published
      const currentDraftId = watch("id")
      if (currentDraftId) {
        deleteDraft(currentDraftId)
      }
    } catch (error) {
      console.error("Error publishing post:", error)
      alert("Failed to publish post.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => {
    setSavingDraft(true)
    const values = watch()
    const catObj = categories.find((c) => c.id === selectedCategory)

    const newDraft = {
      id: values.id || Date.now(), // Use existing ID or generate new one
      savedAt: Date.now(),
      ...values,
      categoryId: catObj?.id || null,
      subCategory: selectedSubCategory,
      thumbnail: mediaFile instanceof File ? mediaFile.name : mediaFile, // Save name if it's a File
      tags, // This is the tags state
      language,
    }

    console.log("Saving draft with tags:", newDraft.tags) // Debug log
    console.log("Saving draft with categoryId:", newDraft.categoryId) // Debug log
    console.log("Saving draft with subCategory:", newDraft.subCategory) // Debug log

    let updatedDrafts
    if (values.id) {
      // Update existing draft
      updatedDrafts = allDrafts.map((draft) => (draft.id === values.id ? newDraft : draft))
    } else {
      // Add new draft
      updatedDrafts = [...allDrafts, newDraft]
    }

    setAllDrafts(updatedDrafts)
    localStorage.setItem("postDrafts", JSON.stringify(updatedDrafts))
    alert("Draft saved to local storage.")
    setSavingDraft(false)
    // Update the form with the new draft ID if it was a new draft
    if (!values.id) {
      setValue("id", newDraft.id)
    }
  }

  const handleDelete = () => {
    const currentDraftId = watch("id")
    if (currentDraftId) {
      deleteDraft(currentDraftId)
    } else {
      reset({
        title: "",
        category: "",
        content: "",
      })
      setValue("content", "")
      setMediaFile(null)
      setTags([])
      setPreviewData(null)
      alert("Form cleared.")
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const res = await axiosInstance.post(
        "/categories",
        {
          name: newCategory,
          description: `This is ${newCategory}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setCategories((prev) => [...prev, res.data.data])
      setNewCategory("")
      setShowCatInput(false)
    } catch (error) {
      console.error("Failed to add category", error)
    }
  }

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return

    const categoryObj = categories.find((c) => c.id === selectedCategory)
    if (!categoryObj) return

    try {
      const res = await axiosInstance.post(
        `/categories/${categoryObj.id}/subcategories`,
        { name: newSubcategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const newSub = res.data.data

      setSubCategories((prev) => [...prev, newSub])
      setNewSubcategory("")
      setShowSubInput(false)

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory
            ? {
                ...cat,
                subcategories: [...(cat.subcategories || []), newSub],
              }
            : cat,
        ),
      )
    } catch (error) {
      console.error("Failed to add subcategory", error)
    }
  }

  return (
    <>
      <NavigationMenu
        path={[
          { label: "Home", href: "/" },
          { label: "Post Form", href: "/post-form" },
        ]}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#F7F8FC] p-4 md:p-8 rounded-md shadow-sm max-w-4xl mx-auto my-8"
      >
        <h1 className="text-2xl font-bold text-[#1F3C5F] mb-4">Add New Post</h1>

        <Input {...register("title")} type="text" placeholder="Article name" className="w-full mb-4" />

        <MediaUpload onFileChange={setMediaFile} initialFile={mediaFile} />

        <div className="p-0 mb-4">
          <TextEditor onChange={(value) => setValue("content", value)} initialContent={contentWatch} />
          <input type="hidden" {...register("content")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Publish
            handleDelete={handleDelete}
            handleSaveDraft={handleSaveDraft}
            tags={tags}
            loading={loading}
            savingDraft={savingDraft} // Pass savingDraft state
            language={language}
            setTags={setTags}
            setLanguage={setLanguage}
          />

          <Categories
            register={register}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            subCategories={subCategories}
            showCatInput={showCatInput}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            setShowCatInput={setShowCatInput}
            showSubInput={showSubInput}
            newSubcategory={newSubcategory}
            setNewSubcategory={setNewSubcategory}
            setShowSubInput={setShowSubInput}
            handleAddCategory={handleAddCategory}
            handleAddSubcategory={handleAddSubcategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" onClick={handlePreview} variant="outline">
            Preview
          </Button>
          <Button
            type="submit"
            className="bg-[#1F3C5F] text-white flex items-center gap-2 hover:bg-[#1F3C5F]/90"
            disabled={loading}
          >
            {loading && <ClipLoader size={16} color="#ffffff" />}
            Publish
          </Button>
        </div>
      </form>

      <div className="max-w-4xl mx-auto my-8">
        <Button type="button" onClick={() => setShowDraftsList((prev) => !prev)} variant="outline" className="w-full">
          {showDraftsList ? "Hide Drafts" : "View Saved Drafts"}
        </Button>
        {showDraftsList && <DraftsList drafts={allDrafts} onLoadDraft={loadDraft} onDeleteDraft={deleteDraft} />}
      </div>

      {previewData && <Preview previewData={previewData} tags={tags} categories={categories} />}
    </>
  )
}

function Publish({ handleDelete, handleSaveDraft, loading, savingDraft, language, setLanguage, tags, setTags }) {
  const handleTagInputChange = (e) => {
    const inputValue = e.target.value
    if (inputValue.includes(",")) {
      const parts = inputValue
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
      const newTags = [...tags]
      parts.forEach((part) => {
        if (!newTags.includes(part)) {
          newTags.push(part)
        }
      })
      setTags(newTags)
      e.target.value = "" // Clear the input after processing
    }
  }

  const handleTagInputBlur = (e) => {
    const inputValue = e.target.value.trim()
    if (inputValue.length > 0) {
      const newTags = [...tags]
      if (!newTags.includes(inputValue)) {
        newTags.push(inputValue)
      }
      setTags(newTags)
      e.target.value = "" // Clear the input after processing
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="bg-white border rounded-md p-4">
      <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">Publish</h2>

      <p className="flex items-center justify-between mb-2 text-sm">
        <span className="flex items-center gap-2">
          <Eye size={16} /> Status:
        </span>
        <span>Draft</span>
      </p>

      <p className="flex items-center justify-between mb-2 text-sm">
        <span className="flex items-center gap-2">
          <Lock size={16} /> Visibility:
        </span>
        <span>Public</span>
      </p>

      <div className="mb-4">
        <Label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
          Language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language-select" className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Hindi">Hindi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="tags-input" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <XCircle size={16} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
            </span>
          ))}
        </div>
        <Input
          id="tags-input"
          type="text"
          placeholder="Add tags separated by commas"
          onChange={handleTagInputChange} // Use onChange for comma separation
          onBlur={handleTagInputBlur} // Add onBlur to capture last tag
          className="w-full"
        />
      </div>

      <p className="flex items-center justify-between mb-4 text-sm">
        <span className="flex items-center gap-2">
          <Clock size={16} /> Publish:
        </span>
        <span>Immediately</span>
      </p>

      <div className="flex justify-between mt-4">
        <Button type="button" onClick={handleDelete} variant="outline" className="text-red-600 hover:text-red-800 border-red-600">
          Delete
        </Button>
        <Button
          type="button"
          onClick={handleSaveDraft}
          className="bg-green-500 text-white flex items-center gap-2 hover:bg-green-500/90 "
          disabled={savingDraft} 
        >
          {savingDraft && <ClipLoader size={16} color="#ffffff" />}
          Save Draft
        </Button>
      </div>
    </div>
  )
}

function Categories({
  register,
  selectedCategory,
  setSelectedCategory,
  categories,
  subCategories,
  showCatInput,
  newCategory,
  setNewCategory,
  setShowCatInput,
  showSubInput,
  newSubcategory,
  setNewSubcategory,
  setShowSubInput,
  handleAddCategory,
  handleAddSubcategory,
  selectedSubCategory,
  setSelectedSubCategory,
}) {
  return (
    <div className="bg-white border rounded-md p-4">
      <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">Categories</h2>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full mb-3">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2 mb-4">
        {subCategories.map((sub) => {
          const subId = typeof sub === "object" ? sub.id : sub
          const subName = typeof sub === "object" ? sub.name : sub
          const isSelected = selectedSubCategory === subId
          return (
            <Button
              key={subId}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${isSelected ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={() => setSelectedSubCategory(subId)}
            >
              {subName}
            </Button>
          )
        })}
      </div>

      {showCatInput ? (
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-1"
          />
          <Button onClick={handleAddCategory} type="button" variant="outline">
            Add
          </Button>
          <Button
            onClick={() => setShowCatInput(false)}
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100"
          >
            <XCircle size={20} />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => setShowCatInput(true)}
          variant="link"
          className="text-blue-600 text-sm flex items-center gap-1 p-0 h-auto mb-2"
        >
          <PlusCircle size={16} /> Add Category
        </Button>
      )}

      {showSubInput ? (
        <div className="flex gap-2">
          <Input
            type="text"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            placeholder="New subcategory"
            className="flex-1"
          />
          <Button onClick={handleAddSubcategory} type="button" variant="outline">
            Add
          </Button>
          <Button
            onClick={() => setShowSubInput(false)}
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100"
          >
            <XCircle size={20} />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => setShowSubInput(true)}
          variant="link"
          className="text-blue-600 text-sm flex items-center gap-1 p-0 h-auto"
        >
          <PlusCircle size={16} /> Add Subcategory
        </Button>
      )}
    </div>
  )
}

function Preview({ previewData, tags, categories }) {
  const categoryName = categories.find((c) => c.id === previewData.categoryId)?.name || "N/A"

  const imageSrc =
    previewData.mediaFile instanceof File ? URL.createObjectURL(previewData.mediaFile) : "/placeholder.svg"

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white rounded-md p-6 shadow-sm border">
      <h2 className="text-2xl font-bold mb-4">{previewData.title}</h2>

      {previewData.mediaFile && (
        <img src={imageSrc || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover rounded-md mb-4" />
      )}

      <div
        className="prose prose-sm sm:prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: previewData.content }}
      />

      <div className="text-sm text-gray-500 mt-4">Category: {categoryName}</div>

      <div className="text-sm text-gray-500 mt-2">
        Tags:{" "}
        {tags.length > 0
          ? tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                {tag}
              </span>
            ))
          : "None"}
      </div>
    </div>
  )
}

export default PostForm
