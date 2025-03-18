"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";

interface CreatePostDialogProps {
    onPostCreated: () => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ onPostCreated }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
    });

    // For controlling the dialog open/close
    const [open, setOpen] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreatePost = async () => {
        try {
            await axios.post("/api/news", form, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast.success("Post created successfully!");
            setForm({ title: "", description: "", imageUrl: "" });
            setOpen(false);
            onPostCreated(); // tell parent to refresh
        } catch (error) {
            toast.error("An error occurred while creating the post.");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center text-white">
                    <CirclePlus className="mr-2" />
                    Create Post
                </Button>
            </DialogTrigger>
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
                    <Button onClick={handleCreatePost}>Create Post</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog;
