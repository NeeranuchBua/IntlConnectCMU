"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@prisma/client";
import { toast } from "react-toastify";
import axios from "axios";

import CreatePostDialog from "./CreatePostDialog";
import DeletePostButton from "./DeletePostButton";
import EditPostDialog from "./EditPostDialog";
import NotifyDialog from "./NotifyDialog";
import Image from "next/image";

const CMUNews = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // State for controlling the editing dialog
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/news");
      if (response.status !== 200) {
        toast.error("Failed to fetch posts");
        return;
      }
      const data = response.data;
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handler for when a new post is created (passed into CreatePostDialog)
  const handlePostCreated = () => {
    fetchPosts();
  };

  // Handler for when a post is updated (passed into EditPostDialog)
  const handlePostUpdated = () => {
    fetchPosts();
  };

  // Handler for opening the edit dialog
  const openEditDialog = (post: Post) => {
    setIsEditing(true);
    setEditingPost(post);
  };

  // Handler for closing the edit dialog
  const closeEditDialog = () => {
    setIsEditing(false);
    setEditingPost(null);
  };

  return (
    <div className="p-9 w-full bg-gray-100 flex-col justify-start items-start gap-9 inline-flex">
      <div className="text-center text-purple-800 text-2xl font-bold">
        CMU News
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog onPostCreated={handlePostCreated} />

      <div className="flex flex-col gap-4 w-full mt-6">
        {loading ? (
          <Skeleton className="w-full h-16" />
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 border rounded-lg bg-white flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-gray-600">{post.description}</p>
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={200}
                    height={200}
                    className="mt-2 rounded-md max-w-sm"
                  />
                )}
              </div>
              <div className="flex gap-2">
                {/* Edit button to open the edit dialog */}
                <Button
                  variant="secondary"
                  onClick={() => openEditDialog(post)}
                  className="flex items-center gap-1"
                >
                  Edit
                </Button>

                {/* Delete button (separate component) */}
                <DeletePostButton postId={post.id} onDeleteSuccess={fetchPosts} />

                <NotifyDialog
                  postId={post.id}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Post Dialog (only rendered if isEditing === true) */}
      {isEditing && editingPost && (
        <EditPostDialog
          post={editingPost}
          onClose={closeEditDialog}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
};

export default CMUNews;
