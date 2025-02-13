"use client";

import CreatePostForm from "@/components/createPostForm";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PostType {
  title: string;
  body: string;
  author: string;
  categories: string[];
  mainImage?: string;
  publishedAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await client.fetch(`
        *[_type == 'post']{
          publishedAt,
          title,
          body,
          categories,
          mainImage,
          author,
          _id,
        }
      `);
      setPosts(response);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen p-6">
      <h1 className="text-center text-[#222] text-5xl font-extrabold font-sans py-8">
        📝 Create Posts
      </h1>

      {/* Create Post Form */}
      <div className="max-w-3xl mx-auto">
        <CreatePostForm />
      </div>

      {/* Posts Section */}
      <h1 className="text-center text-[#222] text-5xl font-extrabold font-sans py-8">
        📝 View Posts
      </h1>
      <section className="max-w-5xl mx-auto mt-12 space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No posts yet. Be the first to create one! 🚀</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 transition-transform hover:scale-105 "
            >
              {/* Image Section */}
              {post.mainImage && (
                <div className="flex justify-center">
                  <Image
                    src={post.mainImage}
                    alt="Post Image"
                    width={300}
                    height={250}
                    className="rounded-lg object-cover shadow-md"
                  />
                </div>
              )}

              {/* Content Section */}
              <div>
                <h3 className="text-[#333] text-2xl font-bold text-center">{post.title}</h3>
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-h-[500px] overflow-y-auto text-gray-800 leading-relaxed mt-4">
                  <p className="whitespace-pre-wrap text-lg">{post.body}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <h4 className="text-gray-600 font-semibold text-md">👤 {post.author}</h4>
                  <span className="text-gray-500 text-sm">{new Date(post.publishedAt).toDateString()}</span>
                </div>
                {/* Categories */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.categories.map((category, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                    >
                      #{category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
