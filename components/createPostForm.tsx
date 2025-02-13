"use client";

import { useState } from "react";

const IMG_BB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const CreatePostForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    author: "",
    categories: "",
    mainImage: "",
    publishedAt: new Date().toISOString(),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [postCreated, setPostCreated] = useState<boolean>(false);
  const [postId, setPostId] = useState<string | null>(null);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image input
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImageToImgBB(file);
    }
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${data.error.message}`);
      }

      const imageUrl = data.data.url;
      console.log("Uploaded Image URL:", imageUrl);

      setImagePreview(imageUrl);
      setFormData((prev) => ({
        ...prev,
        mainImage: imageUrl,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      ...formData,
      categories: formData.categories.split(",").map((c) => c.trim()),
      publishedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        setPostCreated(true);
        setPostId(data._id);
        alert("Post created successfully!");

        // Clear form & hide after submission
        setFormData({
          title: "",
          body: "",
          author: "",
          categories: "",
          mainImage: "",
          publishedAt: new Date().toISOString(),
        });
        setImagePreview(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Post submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Write Post Button */}
      {!showForm && (
        <button
          onClick={toggleForm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
        >
          Write Post
        </button>
      )}

      {/* Form (Hidden until Write Post is clicked) */}
      {showForm && (
        <div className="bg-gray-100 p-6 rounded-xl shadow-lg mt-4">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Create New Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="border p-3 w-full rounded-lg"
              required
            />
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Body"
              className="border p-3 w-full rounded-lg"
              required
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              className="border p-3 w-full rounded-lg"
              required
            />
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="Categories (comma separated)"
              className="border p-3 w-full rounded-lg"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-3 w-full rounded-lg"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 rounded-lg shadow-md w-40"
              />
            )}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={toggleForm}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* View Post Button (Visible only after submission) */}
          {postCreated && postId && (
            <div className="mt-6 text-center">
              <a
                href={`/post/${postId}`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                View Post
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;
