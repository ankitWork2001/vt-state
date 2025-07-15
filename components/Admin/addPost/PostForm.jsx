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
  Loader2,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import TextEditor from "./TextEditor";

const PostForm = () => {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("686e112f2f12f405927ec78c");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [tags, setTags] = useState([]);
  const [language, setLanguage] = useState("English");
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
    const saved = localStorage.getItem("postDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      reset(parsed);
      const catObj = categories.find((c) => c.id === parsed.categoryId);
      if (catObj) {
        setSelectedCategory(catObj.name);
        setSelectedSubCategory(parsed.subCategory || null);
      }
      setTags(parsed.tags || []);
      setLanguage(parsed.language || "English");
      setMediaFile(parsed.thumbnail || null);
    }
  }, [reset, categories]);

  const handlePreview = () => {
    setPreviewData({ ...watch(), mediaFile });
  };
  
const onSubmit = async (data) => {
  setLoading(true);

  try {
    handlePreview();

    const formData = new FormData();
    const catObjonSubmit = categories.find((c) => c.name === selectedCategory);

    formData.append("title", data.title || "");
    formData.append("content", data.content || "");
    formData.append("categoryId", catObjonSubmit.id || "");
    formData.append("language", language || "");

    if (selectedSubCategory) {
      formData.append("subcategoryId", selectedSubCategory);
    }

    if (tags && tags.length > 0) {
        tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
    }

    if (mediaFile) {
      formData.append("thumbnail", mediaFile);
    }

    // Optional: log form data for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    const postRes = await axiosInstance.post("/blogs", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
        // 'Content-Type' is automatically set to 'multipart/form-data' by Axios when using FormData.
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
    const values = watch();
    const catObj = categories.find((c) => c.name === selectedCategory);
    localStorage.setItem(
      "postDraft",
      JSON.stringify({
        ...values,
        categoryId: catObj?.id || null,
        subCategory: selectedSubCategory,
        thumbnail: mediaFile,
        tags,
        language,
      })
    );
    alert("Draft saved to local storage.");
  };

  const handleDelete = () => {
    reset({
      title: "",
      category: "",
      content: "",
    });
    setMediaFile(null);
    setTags([]);
    setPreviewData(null);
    localStorage.removeItem("postDraft");
    alert("Post deleted.");
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axiosInstance.post("/categories",
        {name: newCategory,
          description: `This is ${newCategory}`,
        },
        {headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories((prev) => [...prev, res.data.data]);
      setNewCategory("");
      setShowCatInput(false);
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return;

    const categoryObj = categories.find((c) => c.name === selectedCategory);
    if (!categoryObj) return;

    try {
      const res = await axiosInstance.post(`/categories/${categoryObj.id}/subcategories`,
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
          cat.name === selectedCategory
            ? {
                ...cat,
                subcategories: [...(cat.subcategories || []), newSub],
              }
            : cat
        )
      );
    } catch (error) {
      console.error("Failed to add subcategory", error);
    }
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
        <h1 className="text-[24px] font-bold text-[#1F3C5F] mb-4">Add New Post</h1>

        <input
          {...register("title")}
          type="text"
          placeholder="Article name"
          className="w-full border px-4 py-2 rounded-md focus:outline-none mb-4"
        />

        <MediaUpload mediaFile={mediaFile} onFileSelect={setMediaFile} />
        {mediaFile && (
          <span
            onClick={() => setMediaFile(null)}
            className="px-1 mx-1 font-bold text-red-400 cursor-pointer hover:text-white hover:bg-red-400 rounded"
          >
            X
          </span>
        )}

        <div className="p-6">
          <TextEditor onChange={(value) => setValue("content", value)} />
          <input type="hidden" {...register("content")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Publish
            handleDelete={handleDelete}
            handleSaveDraft={handleSaveDraft}
            tags={tags}
            loading={loading}
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

      {previewData && <Preview previewData={previewData} tags={tags}/>}
    </>
  );
};

export default PostForm;




function Publish({ handleDelete, handleSaveDraft, loading, language, setLanguage, tags, setTags }) {
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="bg-white border rounded-md p-4">
      <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">Publish</h2>

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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
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
        <input
          type="text"
          placeholder="Add a tag and press Enter"
          onKeyDown={handleTagInputKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

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
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Draft"}
        </button>
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
        {subCategories.map((sub) => {
          const subId = typeof sub === "object" ? sub.id : sub;
          const subName = typeof sub === "object" ? sub.name : sub;
          const isSelected = selectedSubCategory === subId;
          return (
            <span
              key={subId}
              className={`cursor-pointer border px-3 py-1 text-sm rounded-full ${
                isSelected ? "bg-gray-300" : "bg-gray-100"
              }`}
              onClick={() => setSelectedSubCategory(subId)}
            >
              {subName}
            </span>
          );
        })}
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
          <button onClick={handleAddCategory} type="button" className="text-blue-600">
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
          <button onClick={handleAddSubcategory} type="button" className="text-blue-600">
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
  );
}



function Preview({ previewData, tags}) {
  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white rounded-md p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-2">{previewData.title}</h2>

      {previewData.mediaFile && (
        <img
          src={URL.createObjectURL(previewData.mediaFile)}
          alt="Preview"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}

      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: previewData.content }}
      />

      <div className="text-sm text-gray-500 mt-4">
        Category: {previewData.category || "N/A"}
      </div>

      <div className="text-sm text-gray-500 mt-4">
        tags: {tags.map((tag) => (
          <span key={tag} value={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}






















// "use client";

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import MediaUpload from "./MediaUpload";
// import NavigationMenu from "@/components/common/NavigationMenu";
// import {
//   Eye,
//   Lock,
//   Clock,
//   PlusCircle,
//   XCircle,
//   Image as ImageIcon,
//   Loader2,
// } from "lucide-react";
// import { axiosInstance } from "@/lib/axios";
// import TextEditor from "./TextEditor";

// const initialCategories = [
//   {
//     id: 1,
//     name: "Essay",
//     subcategories: [
//       "Hindi Essay Writing",
//       "BPSC Essay Models",
//       "Topper’s Essay Copies",
//       "UPSC Essay Framework",
//     ],
//   },
//   {
//     id: 2,
//     name: "Strategy",
//     subcategories: ["Time Management", "Working Professionals"],
//   },
//   {
//     id: 3,
//     name: "Motivational",
//     subcategories: ["Success Stories", "Failure to Success"],
//   },
// ];

// const PostForm = () => {
//   const { register, handleSubmit, setValue, watch, reset } = useForm();
//   const [categories, setCategories] = useState(initialCategories);
//   const [selectedCategory, setSelectedCategory] = useState("Essay");
  
//   const [subCategories, setSubCategories] = useState([]);
//   const [selectedSubCategory, setSelectedSubCategory] = useState();

//   const [tags, setTags] = useState([]);
//   const [language, setLanguage] = useState("English");
//   const [newCategory, setNewCategory] = useState("");

//   const [newSubcategory, setNewSubcategory] = useState("");
//   const [showCatInput, setShowCatInput] = useState(false);
//   const [showSubInput, setShowSubInput] = useState(false);
//   const [mediaFile, setMediaFile] = useState(null);
//   const [previewData, setPreviewData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const matchedCategory = categories.find((c) => c.name === selectedCategory);
//     setSubCategories(matchedCategory?.subcategories || []);
//   }, [selectedCategory, categories]);

//   useEffect(() => {
//     const saved = localStorage.getItem("postDraft");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       reset(parsed);
//       setSelectedCategory(parsed.category || "Essay");
//     }
//   }, [reset]);

//   useEffect( ()=>{
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get('/categories');
//         // console.log(res.data.data);
//         setCategories(res.data.data);
//       } catch (error) {
//         console.error("Failed to fetch categories", error);
//       }
//     };
//   fetchCategories();
//   },[])

//   const handlePreview = () => {
//     setPreviewData({ ...watch(), mediaFile });
//   };


//   const onSubmit = async (data,e) => {
//     e.preventDefault()
//     setLoading(true);
//     handlePreview();

//     try {
//       const postPayload = {
//         ...data,
//         categoryId: selectedCategory,
//         language:language,
//         tags: tags,
//         thumbnail: uploadedImageUrl,
//       };
//       if(selectedSubCategory){
//         postPayload = {...postPayload, subcategorId : selectedSubCategory}
//       }
//       console.log(postPayload)

//       const postRes = await axiosInstance.post("/post",{postPayload} , {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Post submitted:", postRes.data);
//       alert("Post published successfully!");
//     } catch (error) {
//       console.error("Error publishing post:", error);
//       alert("Failed to publish post.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveDraft = () => {
//     handlePreview();
//     const values = watch();
//     const selectedCategoryId = selectedCategory.find(c.name === selectedCategory)
//     localStorage.setItem("postDraft", JSON.stringify({...values, 
//       categoryId:selectedCategoryId, 
//       subCategory:selectedSubCategory, 
//       thumbnail:mediaFile,
//       tags:tags,

//     }));
//     alert("Draft saved to local storage.");
//   };

//   const handleDelete = () => {
//     reset({
//       title: "",
//       category: "",
//       content: ""
//     });
//     setMediaFile(false);
//     localStorage.removeItem("postDraft");
//     setPreviewData(null);
//     alert("Post deleted.");
//   };

//   const handleAddCategory = () => {

//     const addCategory = async () => {
//       if (!newCategory.trim()) return;

//       try {
//         const res = await axiosInstance.post("/categories",
//           {
//             name: newCategory,
//             description: `This is ${newCategory}`,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const newCat = res.data?.data;

//         setCategories((prev) => [...prev, newCat]);
//         console.log(categories)
//         setNewCategory("");
//         setShowCatInput(false);
//       } catch (error) {
//         console.error("Failed to add category", error);
//       }
//     };

//     addCategory();
//   };

//   const handleAddSubcategory = () => {
//     if (!newSubcategory.trim()) return;

//     const addSubCategory = async () => {
//       const categoryId = categories.find((c) => c.name === selectedCategory);

//       if (!categoryId) {
//         console.error("Selected category not found");
//         return;
//       }

//       try {
//         const res = await axiosInstance.post(
//           `/categories/${categoryId.id}/subcategories`,
//           {
//             name: newSubcategory,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const newCatId = res.data?.data;

//         setSubCategories((prev) => [...prev, newCatId]);
//         setNewSubcategory("");
//         setShowSubInput(false);
//         setCategories(
//           categories.map((cat) =>
//             cat.name === selectedCategory
//               ? {
//                   ...cat,
//                   subcategories: [...cat.subcategories, newSubcategory],
//                 }
//               : cat
//           )
//         );
//       } catch (error) {
//         console.error("Failed to add category", error);
//       }
//     };

//     addSubCategory();
//   };

//   return (
//     <>
//       <NavigationMenu
//                 path={[
//                   { label: "Home", href: "/" },
//                   { label: "post-form", href: "/post-form" },
//                 ]}
//               />
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-[#F7F8FC] p-4 md:p-8 rounded-md shadow-sm max-w-4xl mx-auto"
//       >
//         <h1 className="text-[24px] font-bold text-[#1F3C5F] mb-4">
//           Add New Post
//         </h1>

//         {/* Title */}
//         <input
//           {...register("title")}
//           type="text"
//           placeholder="Article name"
//           className="w-full border px-4 py-2 rounded-md focus:outline-none mb-4"
//         />

//         {/* Media Upload */}
//         <MediaUpload mediaFile={mediaFile} onFileSelect={setMediaFile} />
//         {mediaFile && (
//           <span onClick={() => setMediaFile(null)}
//             className="px-1 mx-1 font-bold text-red-400 cursor-pointer hover:text-white hover:bg-red-400 rounded"
//           >X</span>)}

//         {/* Toolbar */}
//         <div className="p-6">
//             <TextEditor onChange={(value) => setValue("content", value)} />
//             <input type="hidden" {...register("content")} />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {/* Publish */}
//           <Publish 
//             handleDelete={handleDelete} 
//             handleSaveDraft={handleSaveDraft}
//             tags={tags}
//             loading={loading}
//             language={language}
//             setTags={setTags}
//             setLanguage={setLanguage}
//           />

//           <Categories
//             register={register}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//             categories={categories}
//             subCategories={subCategories}
//             showCatInput={showCatInput}
//             newCategory={newCategory}
//             setNewCategory={setNewCategory}
//             setShowCatInput={setShowCatInput}
//             showSubInput={showSubInput}
//             newSubcategory={newSubcategory}
//             setNewSubcategory={setNewSubcategory}
//             setShowSubInput={setShowSubInput}
//             handleAddCategory={handleAddCategory}
//             handleAddSubcategory={handleAddSubcategory}
//             selectedSubCategory={selectedSubCategory}
//             setSelectedSubCategory={setSelectedSubCategory}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={handlePreview}
//             className="border border-[#1F3C5F] text-[#1F3C5F] px-4 py-2 rounded-md"
//           >
//             Preview
//           </button>
//           <button
//             type="submit"
//             className="bg-[#1F3C5F] text-white px-4 py-2 rounded-md flex items-center gap-2"
//           >
//             {loading && <Loader2 className="animate-spin" size={16} />}
//             Publish
//           </button>
//         </div>
//       </form>

//       {/* Preview Box */}
//       {previewData && (
//         <Preview previewData={previewData}/>
//       )}
//     </>
//   );
// };

// export default PostForm;



// function Publish({ handleDelete, handleSaveDraft, loading, language,setLanguage,tags, setTags }) {

//   const handleTagInputKeyDown = (e) => {
//   if (e.key === 'Enter' && e.target.value.trim()) {
//     e.preventDefault();
//     if (!tags.includes(e.target.value.trim())) {
//       setTags([...tags, e.target.value.trim()]);
//     }
//     e.target.value = '';
//   }
// };

// const removeTag = (tagToRemove) => {
//   setTags(tags.filter(tag => tag !== tagToRemove));
// };

//   return(
//         <div className="bg-white border rounded-md p-4">
//             <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">
//               Publish
//             </h2>
//             <p className="flex items-center justify-between mb-2">
//               <span className="flex items-center gap-2">
//                 <Eye size={16} /> Status:
//               </span>
//               <span>Draft</span>
//             </p>
//             <p className="flex items-center justify-between mb-2">
//               <span className="flex items-center gap-2">
//                 <Lock size={16} /> Visibility:
//               </span>
//               <span>Public</span>
//             </p>
//               {/* Language Selection */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="English">English</option>
//                   <option value="Hindi">Hindi</option>
//                 </select>
//               </div>

//               {/* Tags Input */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>

//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                     >
//                       <span>{tag}</span>
//                       <XCircle
//                         size={16}
//                         className="cursor-pointer hover:text-red-500 transition"
//                         onClick={() => removeTag(tag)}
//                       />
//                     </span>
//                   ))}
//                 </div>

//                 <input
//                   type="text"
//                   placeholder="Add a tag and press Enter"
//                   onKeyDown={handleTagInputKeyDown}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             <p className="flex items-center justify-between mb-4">
//               <span className="flex items-center gap-2">
//                 <Clock size={16} /> Publish:
//               </span>
//               <span>Immediately</span>
//             </p>

//             <div className="flex justify-between mt-4">
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
//               >
//                 Delete
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="bg-green-500 text-white px-4 py-2 rounded-md"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   "Save Draft"
//                 )}
//               </button>
//             </div>
//           </div>
//   )
// }

// function Categories({
//   register,
//   selectedCategory,
//   setSelectedCategory,
//   categories,
//   subCategories,
//   showCatInput,
//   newCategory,
//   setNewCategory,
//   setShowCatInput,
//   showSubInput,
//   newSubcategory,
//   setNewSubcategory,
//   setShowSubInput,
//   handleAddCategory,
//   handleAddSubcategory,
//   setSelectedSubCategory,
//   selectedSubCategory 
// }) {
//   return(
//               <div className="bg-white border rounded-md p-4">
//             <h2 className="text-lg font-semibold text-[#1F3C5F] mb-4">
//               Categories
//             </h2>

//             <select
//               {...register("category")}
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value) }
//               className="w-full border px-3 py-2 rounded-md mb-3"
//             >
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.name} >
//                   {cat.name}
//                 </option>
//               ))}
//             </select>

//             <div className="flex flex-wrap gap-2 mb-4">
//               {subCategories.map((sub, i) => (
//                 <span
//                   key={typeof sub === 'string' ? sub : i}
//                   className={`border px-3 py-1 text-sm rounded-full ${selectedSubCategory ? bg-gray-300 : bg-gray-100} `}
//                   onClick={()=>setSelectedSubCategory(sub.id)}
//                 >
//                   {typeof sub === 'string' ? sub : sub.name}
//                 </span>
//               ))}
//             </div>

//             {showCatInput ? (
//               <div className="flex gap-2 mb-2">
//                 <input
//                   type="text"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   placeholder="New category"
//                   className="flex-1 border px-2 py-1 rounded"
//                 />
//                 <button
//                   onClick={handleAddCategory}
//                   type="button"
//                   className="text-blue-600"
//                 >
//                   Add
//                 </button>
//                 <XCircle
//                   size={20}
//                   onClick={() => setShowCatInput(false)}
//                   className="cursor-pointer text-gray-500"
//                 />
//               </div>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => setShowCatInput(true)}
//                 className="text-blue-600 text-sm flex items-center gap-1 mb-2"
//               >
//                 <PlusCircle size={16} /> Add Category
//               </button>
//             )}

//             {showSubInput ? (
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={newSubcategory}
//                   onChange={(e) => setNewSubcategory(e.target.value)}
//                   placeholder="New subcategory"
//                   className="flex-1 border px-2 py-1 rounded"
//                 />
//                 <button
//                   onClick={handleAddSubcategory}
//                   type="button"
//                   className="text-blue-600"
//                 >
//                   Add
//                 </button>
//                 <XCircle
//                   size={20}
//                   onClick={() => setShowSubInput(false)}
//                   className="cursor-pointer text-gray-500"
//                 />
//               </div>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => setShowSubInput(true)}
//                 className="text-blue-600 text-sm flex items-center gap-1"
//               >
//                 <PlusCircle size={16} /> Add Subcategory
//               </button>
//             )}
//           </div>

//   )
// }

// function Preview({previewData}){
//   return(        <div className="max-w-4xl mx-auto mt-6 bg-white rounded-md p-6 shadow-sm border">
//           <h2 className="text-xl font-semibold mb-2">{previewData.title}</h2>
//           {previewData.mediaFile && (
//             <img
//               src={URL.createObjectURL(previewData.mediaFile)}
//               alt="Preview"
//               className="w-full h-64 object-cover rounded-md mb-4"
//             />
//           )}
//           <p className="whitespace-pre-wrap text-gray-800">
//             {previewData.content}
//           </p>
//           <div className="text-sm text-gray-500 mt-4">
//             Category: {previewData.category}
//           </div>
//         </div>
// )
// }

