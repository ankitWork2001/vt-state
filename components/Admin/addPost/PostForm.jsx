"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import MediaUpload from "./MediaUpload";
import NavigationMenu from "@/components/common/NavigationMenu";
import {
  Eye,
  Lock,
  Clock,
  PlusCircle,
  XCircle,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";

const initialCategories = [
  {
    id: 1,
    name: "Essay",
    subcategories: [
      "Hindi Essay Writing",
      "BPSC Essay Models",
      "Topper’s Essay Copies",
      "UPSC Essay Framework",
    ],
  },
  {
    id: 2,
    name: "Strategy",
    subcategories: ["Time Management", "Working Professionals"],
  },
  {
    id: 3,
    name: "Motivational",
    subcategories: ["Success Stories", "Failure to Success"],
  },
];

const PostForm = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState("Essay");
  const [subCategories, setSubCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [showCatInput, setShowCatInput] = useState(false);
  const [showSubInput, setShowSubInput] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

useEffect(() => {
  const matchedCategory = categories.find((c) => c.name === selectedCategory);
  setSubCategories(matchedCategory?.subcategories || []);
}, [selectedCategory, categories]);

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("postDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      reset(parsed);
      setSelectedCategory(parsed.category || "Essay");
    }
  }, [reset]);

  useEffect( ()=>{
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        console.log(res.data.data);
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
  fetchCategories();
  },[])

  const handlePreview = () => {
    setPreviewData({ ...watch(), mediaFile });
  };


    const onSubmit = async (data) => {
      setLoading(true);
      handlePreview();

      try {
        let uploadedImageUrl = "";

        if (mediaFile) {
          const formData = new FormData();
          formData.append("file", mediaFile);

          const uploadRes = await axiosInstance.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          uploadedImageUrl = uploadRes.data?.url || "";
          console.log("Uploaded Image URL:", uploadedImageUrl);
        }

        const postPayload = {
          ...data,
          image: uploadedImageUrl,
        };

        const postRes = await axiosInstance.post("/post", postPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Post submitted:", postRes.data);
        alert("Post published successfully!");
      } catch (error) {
        console.error("Error publishing post:", error);
        alert("Failed to publish post.");
      } finally {
        setLoading(false);
      }
    };

  const handleSaveDraft = () => {
    handlePreview();
    const values = watch();
    localStorage.setItem("postDraft", JSON.stringify(values));
    alert("Draft saved to local storage.");
  };

  const handleDelete = () => {
    reset({
      title: "",
      category: "",
      content: ""
    });
    setMediaFile(false);
    localStorage.removeItem("postDraft");
    setPreviewData(null);
    alert("Post deleted.");
  };

  const handleAddCategory = () => {

    const addCategory = async () => {
      if (!newCategory.trim()) return;

      try {
        const res = await axiosInstance.post("/categories",
          {
            name: newCategory,
            description: `This is ${newCategory}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newCat = res.data?.data;

        setCategories((prev) => [...prev, newCat]);
        console.log(categories)
        setNewCategory("");
        setShowCatInput(false);
      } catch (error) {
        console.error("Failed to add category", error);
      }
    };

    addCategory();
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) return;

    const addSubCategory = async () => {
      const categoryId = categories.find((c) => c.name === selectedCategory);

      if (!categoryId) {
        console.error("Selected category not found");
        return;
      }

      try {
        const res = await axiosInstance.post(
          `/categories/${categoryId.id}/subcategories`,
          {
            name: newSubcategory,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newCatId = res.data?.data;

        setSubCategories((prev) => [...prev, newCatId]);
        setNewSubcategory("");
        setShowSubInput(false);
        setCategories(
          categories.map((cat) =>
            cat.name === selectedCategory
              ? {
                  ...cat,
                  subcategories: [...cat.subcategories, newSubcategory],
                }
              : cat
          )
        );
      } catch (error) {
        console.error("Failed to add category", error);
      }
    };

    addSubCategory();
  };

  return (
    <>
      <NavigationMenu
                path={[
                  { label: "Home", href: "/" },
                  { label: "post-form", href: "/post-form" },
                ]}
              />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#F7F8FC] p-4 md:p-8 rounded-md shadow-sm max-w-4xl mx-auto"
      >
        <h1 className="text-[24px] font-bold text-[#1F3C5F] mb-4">
          Add New Post
        </h1>

        {/* Title */}
        <input
          {...register("title")}
          type="text"
          placeholder="Article name"
          className="w-full border px-4 py-2 rounded-md focus:outline-none mb-4"
        />

        {/* Media Upload */}
        <MediaUpload mediaFile={mediaFile} onFileSelect={setMediaFile} />

        {/* Toolbar */}
        <div className="bg-white p-2 flex gap-3 rounded-md mb-4 text-gray-700">
          <button type="button" className="font-bold">
            B
          </button>
          <button type="button" className="italic">
            I
          </button>
          <button type="button" className="underline">
            U
          </button>
          <button type="button">≡</button>
        </div>

        {/* Content */}
        <textarea
          {...register("content")}
          placeholder="Write your content here..."
          rows={8}
          className="w-full border px-4 py-2 rounded-md mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Publish */}
          <div className="bg-white border rounded-md p-4">
            <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">
              Publish
            </h2>
            <p className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Eye size={16} /> Status:
              </span>
              <span>Draft</span>
            </p>
            <p className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Lock size={16} /> Visibility:
              </span>
              <span>Public</span>
            </p>
            <p className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Clock size={16} /> Publish:
              </span>
              <span>Immediately</span>
            </p>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleDelete}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Save Draft"
                )}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border rounded-md p-4">
            <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">
              Categories
            </h2>

            <select
              {...register("category")}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-md mb-3"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mb-4">
              {subCategories.map((sub, i) => (
                <span
                  key={typeof sub === 'string' ? sub : i}
                  className="border px-3 py-1 text-sm rounded-full bg-gray-100"
                >
                  {typeof sub === 'string' ? sub : sub.name}
                </span>
              ))}
            </div>

            {showCatInput ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  onClick={handleAddCategory}
                  type="button"
                  className="text-blue-600"
                >
                  Add
                </button>
                <XCircle
                  size={20}
                  onClick={() => setShowCatInput(false)}
                  className="cursor-pointer text-gray-500"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCatInput(true)}
                className="text-blue-600 text-sm flex items-center gap-1 mb-2"
              >
                <PlusCircle size={16} /> Add Category
              </button>
            )}

            {showSubInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="New subcategory"
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  onClick={handleAddSubcategory}
                  type="button"
                  className="text-blue-600"
                >
                  Add
                </button>
                <XCircle
                  size={20}
                  onClick={() => setShowSubInput(false)}
                  className="cursor-pointer text-gray-500"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSubInput(true)}
                className="text-blue-600 text-sm flex items-center gap-1"
              >
                <PlusCircle size={16} /> Add Subcategory
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handlePreview}
            className="border border-[#1F3C5F] text-[#1F3C5F] px-4 py-2 rounded-md"
          >
            Preview
          </button>
          <button
            type="submit"
            className="bg-[#1F3C5F] text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Publish
          </button>
        </div>
      </form>

      {/* Preview Box */}
      {previewData && (
        <div className="max-w-4xl mx-auto mt-6 bg-white rounded-md p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">{previewData.title}</h2>
          {previewData.mediaFile && (
            <img
              src={URL.createObjectURL(previewData.mediaFile)}
              alt="Preview"
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          )}
          <p className="whitespace-pre-wrap text-gray-800">
            {previewData.content}
          </p>
          <div className="text-sm text-gray-500 mt-4">
            Category: {previewData.category}
          </div>
        </div>
      )}
    </>
  );
};

export default PostForm;
