"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@prisma/client";

interface EditPostDialogProps {
    post: Post;
    onClose: () => void;
    onPostUpdated: () => void;
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({ post, onClose, onPostUpdated }) => {
    const [open, setOpen] = useState(true); // open by default
    const [form, setForm] = useState({
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl || "",
    });

    // Keep open state in sync with parent close
    useEffect(() => {
        if (!open) {
            onClose();
        }
    }, [open, onClose]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEditPost = async () => {
        try {
            await axios.put(`/api/news/${post.id}`, form, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast.success("Post updated successfully!");
            setOpen(false);
            onPostUpdated(); // tell parent to refresh
        } catch (error) {
            toast.error("An error occurred while updating the post.");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <Input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleInputChange}
                        className="border-gray-300"
                    />
                    <Textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleInputChange}
                        className="border-gray-300"
                    />
                    <Input
                        name="imageUrl"
                        placeholder="Image URL"
                        value={form.imageUrl}
                        onChange={handleInputChange}
                        className="border-gray-300"
                    />
                    <Button onClick={handleEditPost}>Update Post</Button>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostDialog;
