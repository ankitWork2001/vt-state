"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import MediaUpload from "@/components/Admin/addPost/MediaUpload";
import { Eye, Lock, Clock, PlusCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import TextEditor from "@/components/Admin/addPost/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XCircle } from "lucide-react";
import DraftsList from "@/components/Admin/addPost/DraftsList";
import toast from "react-hot-toast";

const isContentEmpty = (htmlContent) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  return div.textContent.trim().length === 0;
};

const PostForm = ({
  postId = null,
  onPostSuccess = () => {},
  onCancelEdit = () => {},
  setActiveTab,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [language, setLanguage] = useState("English");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [showCatInput, setShowCatInput] = useState(false);
  const [showSubInput, setShowSubInput] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showDraftsList, setShowDraftsList] = useState(false);
  const [allDrafts, setAllDrafts] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const contentWatch = watch("content");

  const lastInitializedPostId = useRef(undefined);

  console.log("tage", tags);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const matchedCategory = categories.find((c) => c.id === selectedCategory);
    setSubCategories(matchedCategory?.subcategories || []);
    if (
      selectedSubCategory &&
      !matchedCategory?.subcategories.some(
        (sub) => sub.id === selectedSubCategory
      )
    ) {
      setSelectedSubCategory(null);
    }
  }, [selectedCategory, categories, selectedSubCategory]);

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("postDrafts") || "[]");
    setAllDrafts(savedDrafts.sort((a, b) => b.savedAt - a.savedAt));
  }, []);

  useEffect(() => {
    const isReadyToInitialize = categories.length > 0;
    const hasPostIdChanged = postId !== lastInitializedPostId.current;
    const isNewPostModeAndUninitialized =
      postId === null && lastInitializedPostId.current !== null;

    if (!isReadyToInitialize) return;

    if (postId && hasPostIdChanged) {
      console.log("Initializing for edit mode:", postId);
      const fetchPost = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(`/blogs/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const blog = res.data.blog;
          if (blog) {
            reset({
              title: blog.title,
              content: blog.content,
              id: blog._id,
            });
            setValue("content", blog.content);

            const blogCategoryId = blog.categoryId?._id || "";
            const blogSubcategoryId = blog.subcategoryId?._id || null;

            const foundCategory = categories.find(
              (cat) => cat.id === blogCategoryId
            );
            setSelectedCategory(foundCategory ? blogCategoryId : "");

            if (
              foundCategory &&
              foundCategory.subcategories.some(
                (sub) => sub.id === blogSubcategoryId
              )
            ) {
              setSelectedSubCategory(blogSubcategoryId);
            } else {
              setSelectedSubCategory(null);
            }

            setTags(
              Array.isArray(blog.tags)
                ? blog.tags.flatMap((tag) => {
                    try {
                      if (
                        typeof tag === "string" &&
                        tag.startsWith("[") &&
                        tag.endsWith("]")
                      ) {
                        return JSON.parse(tag); // Parse it as a JSON array
                      }
                      return tag;
                    } catch (e) {
                      return tag;
                    }
                  })
                : []
            );

            setLanguage(blog.language || "English");
            if (blog.thumbnail) {
              setMediaFile(blog.thumbnail);
            } else {
              setMediaFile(null);
            }
            lastInitializedPostId.current = postId;
          }
        } catch (error) {
          console.error("Failed to fetch post for editing:", error);
          toast.error("Failed to load post for editing.");
          onCancelEdit();
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else if (
      isNewPostModeAndUninitialized ||
      (!postId && lastInitializedPostId.current === undefined)
    ) {
      console.log("Initializing for new post mode.");
      reset();
      setValue("content", "");
      setValue("id", null);
      setMediaFile(null);
      setTags([]);
      setPreviewData(null);

      setSelectedCategory(categories[0]?.id || "");
      setSelectedSubCategory(null);
      setLanguage("English");
      lastInitializedPostId.current = null;
    }
  }, [postId, categories, token, reset, setValue, onCancelEdit]);

  useEffect(() => {
    let urlToRevoke = null;
    if (mediaFile instanceof File) {
      urlToRevoke = URL.createObjectURL(mediaFile);
    }
    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [mediaFile]);

  const loadDraft = (id) => {
    const draftToLoad = allDrafts.find((draft) => draft.id === id);
    if (draftToLoad) {
      reset(draftToLoad);
      setValue("content", draftToLoad.content);
      setSelectedCategory(
        draftToLoad.categoryId ||
          (categories.length > 0 ? categories[0].id : "")
      );
      setSelectedSubCategory(draftToLoad.subCategory || null);
      setTags(
        Array.isArray(draftToLoad.tags)
          ? draftToLoad.tags
          : (draftToLoad.tags || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
      );
      setLanguage(draftToLoad.language || "English");
      setMediaFile(draftToLoad.thumbnail || null);
      setShowDraftsList(false);
      toast.success("Draft loaded successfully!");
      lastInitializedPostId.current = draftToLoad.id;
    } else {
      toast.error("Draft not found.");
    }
  };

  const deleteDraft = (id) => {
    const updatedDrafts = allDrafts.filter((draft) => draft.id !== id);
    setAllDrafts(updatedDrafts);
    localStorage.setItem("postDrafts", JSON.stringify(updatedDrafts));
    toast.success("Draft deleted.");
    if (watch("id") === id) {
      reset({
        title: "",
        category: "",
        content: "",
      });
      setValue("content", "");
      setValue("id", null);
      setMediaFile(null);
      setTags([]);
      setPreviewData(null);
      setSelectedCategory(categories[0]?.id || "");
      setSelectedSubCategory(null);
      setLanguage("English");
      lastInitializedPostId.current = null;
    }
  };

  const handlePreview = () => {
    setPreviewData({
      ...watch(),
      mediaFile,
      categoryId: selectedCategory,
      selectedCategory,
    });
  };

  const onSubmit = async (data) => {
    let isValid = true;
    clearErrors();
    setThumbnailError(false);

    if (!data.title || data.title.trim() === "") {
      setError("title", { message: "Article title is required." });
      isValid = false;
    }

    if (isContentEmpty(data.content)) {
      setError("content", { message: "Article content is required." });
      isValid = false;
    }

    if (!mediaFile && !postId) {
      setThumbnailError(true);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      handlePreview();
      const formData = new FormData();
      const catObj = categories.find((c) => c.id === selectedCategory);

      const categoryId = previewData.categoryId || previewData.selectedCategory;
      const categoryName =
        categories.find((c) => c.id === categoryId)?.name || "N/A";

      formData.append("title", data.title || "");
      formData.append("content", data.content || "");
      formData.append("language", language || "");

      if (catObj?.id) {
        formData.append("categoryId", catObj.id);
      } else {
        formData.append("categoryId", selectedCategory || "");
      }

      if (selectedSubCategory) {
        formData.append("subcategoryId", selectedSubCategory);
      }

      if (tags && tags.length > 0) {
        formData.append("tags", tags);
      } else {
        formData.append("tags", "[]");
      }

      if (mediaFile instanceof File) {
        formData.append("thumbnail", mediaFile);
      }

      let res;
      if (postId) {
        res = await axiosInstance.put(`/blogs/${postId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Post updated successfully!");
      } else {
        res = await axiosInstance.post("/blogs", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Post published successfully!");
      }

      console.log("Post submitted/updated:", res.data);
      onPostSuccess(res.data.blog || res.data.data);

      reset({
        title: "",
        category: "",
        content: "",
      });
      setValue("content", "");
      setValue("id", null);
      setMediaFile(null);
      setTags([]);
      setPreviewData(null);
      setSelectedCategory(categories[0]?.id || "");
      setSelectedSubCategory(null);
      setLanguage("English");
      lastInitializedPostId.current = null;

      const currentDraftId = watch("id");
      if (currentDraftId) {
        deleteDraft(currentDraftId);
      }
    } catch (error) {
      console.error("Error publishing/updating post:", error);
      toast.error("Failed to publish/update post.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setSavingDraft(true);
    const values = watch();
    const catObj = categories.find((c) => c.id === selectedCategory);

    const newDraft = {
      id: values.id || Date.now(),
      savedAt: Date.now(),
      ...values,
      categoryId: catObj?.id || null,
      subCategory: selectedSubCategory,
      tags,
      language,
      thumbnail: typeof mediaFile === "string" ? mediaFile : null,
    };

    let updatedDrafts;
    if (values.id) {
      updatedDrafts = allDrafts.map((draft) =>
        draft.id === values.id ? newDraft : draft
      );
    } else {
      updatedDrafts = [...allDrafts, newDraft];
    }

    setAllDrafts(updatedDrafts.sort((a, b) => b.savedAt - a.savedAt));
    localStorage.setItem(
      "postDrafts",
      JSON.stringify(updatedDrafts.sort((a, b) => b.savedAt - a.savedAt))
    );
    toast.success("Draft saved to local storage.");
    setSavingDraft(false);
    if (!values.id) {
      setValue("id", newDraft.id);
      lastInitializedPostId.current = newDraft.id;
    }
  };

  const handleDelete = () => {
    const currentDraftId = watch("id");
    if (currentDraftId) {
      deleteDraft(currentDraftId);
    } else {
      reset({
        title: "",
        category: "",
        content: "",
      });
      setValue("content", "");
      setValue("id", null);
      setMediaFile(null);
      setTags([]);
      setPreviewData(null);
      setSelectedCategory(categories[0]?.id || "");
      setSelectedSubCategory(null);
      setLanguage("English");
      toast.info("Form cleared.");
      lastInitializedPostId.current = null;
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

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
        }
      );

      setCategories((prev) => [...prev, res.data.data]);
      setNewCategory("");
      setShowCatInput(false);
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Failed to add category", error);
      toast.error("Failed to add category.");
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return;

    const categoryObj = categories.find((c) => c.id === selectedCategory);
    if (!categoryObj) {
      toast.error("Please select a category first.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/categories/${categoryObj.id}/subcategories`,
        { name: newSubcategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newSub = res.data.data;

      setSubCategories((prev) => [...prev, newSub]);
      setNewSubcategory("");
      setShowSubInput(false);

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory
            ? {
                ...cat,
                subcategories: [...(cat.subcategories || []), newSub],
              }
            : cat
        )
      );
      toast.success("Subcategory added successfully!");
    } catch (error) {
      console.error("Failed to add subcategory", error);
      toast.error("Failed to add subcategory.");
    }
  };

  return (
    <>
      {postId && (
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 mt-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Back to Posts
        </button>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#F7F8FC] p-4 md:p-8 rounded-md shadow-sm max-w-4xl mx-auto my-0"
      >
        <h1 className="text-2xl font-bold text-[#1F3C5F] mb-4">
          {postId ? "Edit Post" : "Add New Post"}
        </h1>

        <Input
          {...register("title")}
          type="text"
          placeholder="Article name"
          className={`w-full mb-4 ${
            errors.title ? "border-red-500 focus:border-red-500" : ""
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>
        )}

        <MediaUpload
          onFileChange={(file) => {
            setMediaFile(file);
            setThumbnailError(false);
          }}
          initialFile={mediaFile}
          isInvalid={thumbnailError}
        />
        {thumbnailError && (
          <p className="text-red-500 text-sm mb-2">
            Thumbnail image is required.
          </p>
        )}

        <div className="p-0 mb-4">
          <p className="text-sm text-gray-600 mb-2">
            **Tip for bullet points:** To create a bulleted list, type your
            introductory text, then press `Enter` twice to start a new line.
            Now, click the bullet list button. Each subsequent `Enter` will
            create a new list item. Press `Enter` twice to exit the list.
          </p>
          <TextEditor
            onChange={(value) => {
              setValue("content", value);
              clearErrors("content");
            }}
            initialContent={contentWatch}
            isInvalid={!!errors.content}
          />
          <input type="hidden" {...register("content")} />
        </div>
        {errors.content && (
          <p className="text-red-500 text-sm mb-2">{errors.content.message}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Publish
            handleDelete={handleDelete}
            handleSaveDraft={handleSaveDraft}
            tags={tags}
            loading={loading}
            savingDraft={savingDraft}
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
            type="button"
            onClick={() => setShowDraftsList((prev) => !prev)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {showDraftsList
              ? "Hide Drafts"
              : `View Saved Drafts (${allDrafts.length})`}
          </Button>
          <Button
            type="submit"
            className="bg-[#1F3C5F] text-white flex items-center gap-2 hover:bg-[#1F3C5F]/90"
            disabled={loading}
          >
            {loading && <ClipLoader size={16} color="#ffffff" />}
            {postId ? "Update Post" : "Publish"}
          </Button>
        </div>
      </form>

      <div className="max-w-4xl mx-auto my-0">
        {showDraftsList && (
          <DraftsList
            drafts={allDrafts}
            onLoadDraft={loadDraft}
            onDeleteDraft={deleteDraft}
          />
        )}
      </div>

      {previewData && (
        <Preview
          previewData={previewData}
          tags={tags}
          categories={categories}
        />
      )}
    </>
  );
};

function Publish({
  handleDelete,
  handleSaveDraft,
  loading,
  savingDraft,
  language,
  setLanguage,
  tags,
  setTags,
}) {
  const handleTagInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.includes(",")) {
      const parts = inputValue
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
      const newTags = [...tags];
      parts.forEach((part) => {
        if (!newTags.includes(part)) {
          newTags.push(part);
        }
      });
      setTags(newTags);
      e.target.value = "";
    }
  };

  const handleTagInputBlur = (e) => {
    const inputValue = e.target.value.trim();
    if (inputValue.length > 0) {
      const newTags = [...tags];
      if (!newTags.includes(inputValue)) {
        newTags.push(inputValue);
      }
      setTags(newTags);
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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
        <Label
          htmlFor="language-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
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
        <Label
          htmlFor="tags-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags
        </Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.length > 0 &&
            tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <XCircle
                  size={16}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => removeTag(tag)}
                />
              </span>
            ))}
        </div>
        <Input
          id="tags-input"
          type="text"
          placeholder="Add tags separated by commas"
          onChange={handleTagInputChange}
          onBlur={handleTagInputBlur}
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
        <Button
          type="button"
          onClick={handleDelete}
          variant="outline"
          className="text-red-600 hover:text-red-800 border-red-600 bg-transparent"
        >
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
  );
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
          const subId = typeof sub === "object" ? sub.id : sub;
          const subName = typeof sub === "object" ? sub.name : sub;
          const isSelected = selectedSubCategory === subId;
          return (
            <Button
              key={subId}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${
                isSelected
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedSubCategory(subId)}
            >
              {subName}
            </Button>
          );
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
          <Button
            onClick={handleAddSubcategory}
            type="button"
            variant="outline"
          >
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
  );
}

function Preview({ previewData, tags, categories }) {
  console.log({ previewData });

  const categoryName =
    categories.find((c) => c.id === previewData.categoryId)?.name || "N/A";

  const imageSrc =
    previewData.mediaFile instanceof File
      ? URL.createObjectURL(previewData.mediaFile)
      : "/placeholder.svg";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-md p-6 shadow-sm border">
      <h2 className="text-2xl font-bold mb-4">{previewData.title}</h2>

      {previewData.mediaFile && (
        <img
          src={imageSrc || "/placeholder.svg"}
          alt="Preview"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
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
              <span
                key={tag}
                className="inline-block bg-gray-100 px-2 py-1 rounded mr-2"
              >
                {tag}
              </span>
            ))
          : "None"}
      </div>
    </div>
  );
}

export default PostForm;
