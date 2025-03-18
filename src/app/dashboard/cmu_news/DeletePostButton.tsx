"use client";

import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeletePostButtonProps {
    postId: string;
    onDeleteSuccess: () => void;
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, onDeleteSuccess }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/news/${postId}`);
            toast.success("Post deleted successfully!");
            onDeleteSuccess();
        } catch (error) {
            toast.error("An error occurred while deleting the post.");
            console.error(error);
        }
    };

    return (
        <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-1"
        >
            <Trash2 size={16} />
            Delete
        </Button>
    );
};

export default DeletePostButton;
