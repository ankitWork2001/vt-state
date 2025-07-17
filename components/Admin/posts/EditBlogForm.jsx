"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";

const EditBlogForm = ({ postId, onCancel, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [fullPost, setFullPost] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      language: "English",
      categoryId: "",
      subcategoryId: "",
    },
  });

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const [blogRes, categoryRes] = await Promise.all([
          axiosInstance.get(`/blogs/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (blogRes.data?.blog) {
          const blog = blogRes.data.blog;
          setFullPost(blog);
          setThumbnailPreview(blog.thumbnail || null);

          reset({
            title: blog.title,
            content: blog.content,
            tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
            language: blog.language || "English",
            categoryId: blog.categoryId?._id || "",
            subcategoryId: blog.subcategoryId?._id || "",
          });
        }

        if (categoryRes?.data?.data) {
          setCategories(categoryRes.data.data);
          const allSubcats = categoryRes.data.data.flatMap(
            (cat) => cat.subcategories || []
          );
          setSubcategories(allSubcats);
        }
      } catch (error) {
        console.error("Error fetching blog or categories:", error);
      }
    };

    fetchDetails();
  }, [postId, reset]);

  useEffect(() => {
    setValue("subcategoryId", "");
  }, [selectedCategoryId, setValue]);

  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId
  );
  const currentSubcategories = selectedCategory?.subcategories || [];
  const finalSubcategoryId =
    watch("subcategoryId") || fullPost?.subcategoryId?._id || "";

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setValue("thumbnail", file);

      return () => URL.revokeObjectURL(url);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("language", data.language);
    formData.append("categoryId", data.categoryId);

    const parsedTags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(parsedTags));

    if (finalSubcategoryId) {
      formData.append("subcategoryId", finalSubcategoryId);
    }

    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        `/blogs/${fullPost?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.blog) {
        onSuccess(response.data.blog);

        reset();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Update failed. Please try again later.";
      console.error("Update failed:", errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg space-y-3 overflow-auto"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Edit Blog Post
      </h2>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          className={`w-full rounded-sm border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="Enter blog title"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Language and Tags */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            {...register("language")}
            className="w-full rounded-sm border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            {...register("tags")}
            placeholder="Comma-separated tags"
            className="w-full rounded-sm border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          {fullPost?.categoryId?.name && (
            <p className="mb-2 text-sm text-gray-600">
              Current Category: <strong>{fullPost.categoryId.name}</strong>
            </p>
          )}
          <select
            {...register("categoryId", { required: "Category is required" })}
            className={`w-full rounded-sm border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.categoryId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Subcategory
          </label>
          <select
            {...register("subcategoryId")}
            className="w-full rounded-sm border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedCategoryId || subcategories.length === 0}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcat) => (
              <option className="text-[12px]" key={subcat.id} value={subcat.id}>
                {subcat.name}
              </option>
            ))}
          </select>

          {!selectedCategoryId || subcategories.length === 0 ? (
            <p className="text-sm text-gray-500 mt-1">
              No subcategories available
            </p>
          ) : null}
        </div>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Thumbnail
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="block w-full text-xs text-gray-600 file:border file:border-gray-300 file:rounded-sm file:px-3 file:py-1.5"
        />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="mt-2 w-20 h-20 object-cover rounded-sm border"
          />
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          {...register("content", { required: "Content is required" })}
          rows={3}
          className={`w-full rounded-sm border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${
            errors.content
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="Write your blog content here..."
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-sm text-xs hover:bg-gray-300 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditBlogForm;
